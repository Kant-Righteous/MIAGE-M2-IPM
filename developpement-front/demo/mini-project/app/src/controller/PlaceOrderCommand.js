export class PlaceOrderCommand {
  #receiver
  #draft

  constructor(receiver, draft) {
    this.#receiver = receiver
    this.#draft = structuredClone(draft)
  }

  execute() {
    return this.#receiver.placeOrder(this.#draft)
  }
}
