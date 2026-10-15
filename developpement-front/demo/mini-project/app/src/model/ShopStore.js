import initialProducts from './products.json' with { type: 'json' }
import { ObservableSubject } from './ObservableSubject.js'
import { placeOrder as processOrder } from './orderModel.js'

const constructorKey = Symbol('ShopStore')

export class ShopStore {
  static #instance
  #subject

  constructor(key) {
    if (key !== constructorKey) {
      throw new Error('Use ShopStore.getInstance().')
    }
    this.#subject = new ObservableSubject({
      products: initialProducts.map((product) => ({ ...product })),
      orders: [],
    })
  }

  static getInstance() {
    if (!ShopStore.#instance) {
      ShopStore.#instance = new ShopStore(constructorKey)
    }
    return ShopStore.#instance
  }

  getSnapshot = () => this.#subject.getSnapshot()

  subscribe = (observer) => this.#subject.subscribe(observer)

  placeOrder(draft) {
    const current = this.getSnapshot()
    const result = processOrder(current.products, draft)
    if (result.valid) {
      this.#subject.update({
        products: result.products,
        orders: [...current.orders, result.order],
      })
    }
    return result
  }
}
