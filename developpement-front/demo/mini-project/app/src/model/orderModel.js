import { OrderBuilder } from './OrderBuilder.js'
import {
  CustomerValidationDecorator,
  OrderItemsValidator,
  StockValidationDecorator,
  UniqueProductsDecorator,
} from './orderValidators.js'

const itemsValidator = new StockValidationDecorator(
  new UniqueProductsDecorator(new OrderItemsValidator()),
)
const orderValidator = new CustomerValidationDecorator(itemsValidator)

function applyStockDeduction(products, items) {
  const quantities = new Map(items.map(({ productId, quantity }) => [productId, quantity]))
  return products.map((product) => {
    const orderedQuantity = quantities.get(product.id)
    return orderedQuantity === undefined
      ? product
      : { ...product, quantity: product.quantity - orderedQuantity }
  })
}

export function placeOrder(products, draft) {
  const validation = orderValidator.validate(products, draft)
  if (!validation.valid) return validation

  const builder = new OrderBuilder().withCustomer(draft)
  for (const item of draft.items) {
    builder.addItem(item)
  }
  const order = builder.build()
  return {
    valid: true,
    products: applyStockDeduction(products, order.items),
    order,
  }
}
