import assert from 'node:assert/strict'
import test from 'node:test'
import initialProducts from '../src/model/products.json' with { type: 'json' }
import { ObservableSubject } from '../src/model/ObservableSubject.js'
import { OrderBuilder } from '../src/model/OrderBuilder.js'
import { ShopStore } from '../src/model/ShopStore.js'
import {
  CustomerValidationDecorator,
  OrderItemsValidator,
  StockValidationDecorator,
  UniqueProductsDecorator,
} from '../src/model/orderValidators.js'
import { deductOrderStock, placeOrder, validateOrderItems } from '../src/model/orderModel.js'
import {
  filterProducts,
  getAvailableProducts,
  getCategoryStats,
  isLowStock,
} from '../src/model/productModel.js'
import { PlaceOrderCommand } from '../src/controller/PlaceOrderCommand.js'
import { OrderSubmission } from '../src/controller/OrderSubmission.js'

const customer = { lastName: ' Dupont ', firstName: ' Alice ', email: ' alice@example.com ' }
const makeDraft = (items = [{ productId: 'pomme', quantity: 2 }]) => ({ ...customer, items })

test('initial products have unique identifiers and the expected Fruit statistics', () => {
  assert.equal(initialProducts.length, 18)
  assert.equal(new Set(initialProducts.map(({ id }) => id)).size, 18)
  assert.equal(new Set(initialProducts.map(({ category }) => category)).size, 4)
  assert.deepEqual(getCategoryStats(initialProducts).Fruit, {
    productCount: 5, totalStock: 40, averageStock: 8,
  })
})

test('all product attributes can be filtered together or individually', () => {
  assert.equal(filterProducts(initialProducts, { name: ' POMME ', category: 'Fruit' }).length, 1)
  for (const [filters, predicate] of [
    [{ minPrice: '2' }, (p) => p.price >= 2],
    [{ maxPrice: '2' }, (p) => p.price <= 2],
    [{ minQuantity: '5' }, (p) => p.quantity >= 5],
    [{ maxQuantity: '5' }, (p) => p.quantity <= 5],
    [{ minRestockThreshold: '5' }, (p) => p.restockThreshold >= 5],
    [{ maxRestockThreshold: '5' }, (p) => p.restockThreshold <= 5],
  ]) {
    assert.deepEqual(filterProducts(initialProducts, filters), initialProducts.filter(predicate))
  }
  assert.deepEqual(filterProducts(initialProducts, { minPrice: '5', maxPrice: '1' }), [])
})

test('low stock means strictly below the restocking threshold', () => {
  assert.equal(isLowStock({ quantity: 5, restockThreshold: 5 }), false)
  assert.equal(isLowStock({ quantity: 4, restockThreshold: 5 }), true)
})

test('the builder creates an independent order from customer and item steps', () => {
  const builder = new OrderBuilder().withCustomer(customer).addItem({ productId: 'pomme', quantity: 2 })
  const order = builder.build()
  builder.addItem({ productId: 'banane', quantity: 1 })
  assert.deepEqual(order, {
    lastName: 'Dupont', firstName: 'Alice', email: 'alice@example.com',
    items: [{ productId: 'pomme', quantity: 2 }],
  })
  assert.equal(builder.build().items.length, 2)
  assert.throws(() => new OrderBuilder().build(), /incomplete order/)
})

test('decorators add distinct rules through the same validator interface', () => {
  const base = new OrderItemsValidator()
  const repeated = makeDraft([{ productId: 'pomme', quantity: 1 }, { productId: 'pomme', quantity: 1 }])
  assert.equal(base.validate(initialProducts, repeated).valid, true)
  assert.equal(new UniqueProductsDecorator(base).validate(initialProducts, repeated).reason, 'duplicate-product')
  const tooMany = makeDraft([{ productId: 'pomme', quantity: 13 }])
  assert.equal(base.validate(initialProducts, tooMany).valid, true)
  assert.equal(new StockValidationDecorator(base).validate(initialProducts, tooMany).reason, 'insufficient-stock')
  const full = new CustomerValidationDecorator(new StockValidationDecorator(new UniqueProductsDecorator(base)))
  assert.equal(full.validate(initialProducts, makeDraft()).valid, true)
  assert.equal(full.validate(initialProducts, { ...makeDraft(), email: 'invalid' }).reason, 'invalid-email')
})

test('a decorator preserves a failure from its wrapped validator', () => {
  const failure = { valid: false, reason: 'empty-order' }
  const validator = new StockValidationDecorator({ validate: () => failure })
  assert.equal(validator.validate(initialProducts, {}), failure)
})

test('invalid customer details and empty orders are rejected', () => {
  assert.equal(placeOrder(initialProducts, null).reason, 'invalid-customer')
  assert.equal(placeOrder(initialProducts, { ...makeDraft(), lastName: ' ' }).reason, 'invalid-customer')
  assert.equal(placeOrder(initialProducts, { ...makeDraft(), firstName: ' ' }).reason, 'invalid-customer')
  assert.equal(placeOrder(initialProducts, { ...makeDraft(), email: 'invalid' }).reason, 'invalid-email')
  assert.equal(placeOrder(initialProducts, makeDraft([])).reason, 'empty-order')
})

test('quantities must be positive integers and products must exist', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity, '2', null, undefined]) {
    assert.equal(validateOrderItems(initialProducts, [{ productId: 'pomme', quantity }]).reason, 'invalid-quantity')
  }
  assert.equal(validateOrderItems(initialProducts, [{ productId: 'missing', quantity: 1 }]).reason, 'unknown-product')
})

test('stock deduction is immutable and rejects an invalid order as a whole', () => {
  const before = structuredClone(initialProducts)
  const rejected = deductOrderStock(initialProducts, [
    { productId: 'pomme', quantity: 2 }, { productId: 'banane', quantity: 4 },
  ])
  assert.equal(rejected.reason, 'insufficient-stock')
  const result = placeOrder(initialProducts, makeDraft([
    { productId: 'pomme', quantity: 2 }, { productId: 'banane', quantity: 1 },
  ]))
  assert.equal(result.valid, true)
  assert.equal(result.products.find(({ id }) => id === 'pomme').quantity, 10)
  assert.equal(result.products.find(({ id }) => id === 'banane').quantity, 2)
  assert.equal(getCategoryStats(result.products).Fruit.averageStock, 7.4)
  assert.deepEqual(initialProducts, before)
})

test('an exhausted product cannot be ordered again or offered for selection', () => {
  const result = placeOrder(initialProducts, makeDraft([{ productId: 'banane', quantity: 3 }]))
  assert.equal(result.products.find(({ id }) => id === 'banane').quantity, 0)
  assert.equal(getAvailableProducts(result.products).some(({ id }) => id === 'banane'), false)
  assert.equal(placeOrder(result.products, makeDraft([{ productId: 'banane', quantity: 1 }])).reason, 'insufficient-stock')
})

test('observers receive a stable updated snapshot and can unsubscribe', () => {
  const initial = { count: 0 }
  const subject = new ObservableSubject(initial)
  const seen = []
  const unsubscribe = subject.subscribe(() => seen.push(subject.getSnapshot()))
  subject.update(initial)
  assert.equal(seen.length, 0)
  const next = { count: 1 }
  subject.update(next)
  assert.equal(subject.getSnapshot(), next)
  assert.deepEqual(seen, [next])
  unsubscribe()
  subject.update({ count: 2 })
  assert.equal(seen.length, 1)
})

test('the command captures its request and delegates execution to its receiver', () => {
  const draft = makeDraft()
  const received = []
  const result = { valid: true }
  const command = new PlaceOrderCommand({ placeOrder: (request) => { received.push(request); return result } }, draft)
  draft.items[0].quantity = 99
  assert.equal(received.length, 0)
  assert.equal(command.execute(), result)
  assert.equal(received[0].items[0].quantity, 2)
})

test('the singleton store commits products and orders in one notification', () => {
  const store = ShopStore.getInstance()
  assert.equal(ShopStore.getInstance(), store)
  assert.throws(() => new ShopStore(), /getInstance/)
  const before = store.getSnapshot()
  const seen = []
  const unsubscribe = store.subscribe(() => seen.push(store.getSnapshot()))
  assert.equal(new PlaceOrderCommand(store, makeDraft([{ productId: 'pomme', quantity: 99 }])).execute().valid, false)
  assert.equal(store.getSnapshot(), before)
  assert.equal(seen.length, 0)
  const result = new PlaceOrderCommand(store, makeDraft()).execute()
  assert.equal(result.valid, true)
  assert.equal(seen.length, 1)
  assert.equal(seen[0].products.find(({ id }) => id === 'pomme').quantity, 10)
  assert.equal(seen[0].orders.length, 1)
  assert.equal(before.products.find(({ id }) => id === 'pomme').quantity, 12)
  assert.equal(before.orders.length, 0)
  unsubscribe()
  new PlaceOrderCommand(store, makeDraft()).execute()
  assert.equal(seen.length, 1)
})

test('a rejected submission can be edited or retried', () => {
  const submission = new OrderSubmission()
  const invalid = { valid: false, reason: 'insufficient-stock' }
  const success = { valid: true }
  assert.equal(submission.getSnapshot().status, 'editing')
  assert.equal(submission.submit(makeDraft(), () => invalid), invalid)
  assert.equal(submission.getSnapshot().status, 'rejected')
  submission.edit()
  assert.deepEqual(submission.getSnapshot(), { status: 'editing', result: null })
  submission.submit(makeDraft(), () => invalid)
  assert.equal(submission.submit(makeDraft(), () => success), success)
  assert.equal(submission.getSnapshot().status, 'accepted')
})

test('an accepted submission prevents repeat execution until the form changes', () => {
  const submission = new OrderSubmission()
  const success = { valid: true }
  let executions = 0
  const execute = () => { executions += 1; return success }
  submission.submit(makeDraft(), execute)
  assert.equal(submission.submit(makeDraft(), execute), success)
  assert.equal(executions, 1)
  submission.edit()
  submission.submit(makeDraft(), execute)
  assert.equal(executions, 2)
})
