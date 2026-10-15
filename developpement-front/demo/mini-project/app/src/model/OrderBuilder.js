export class OrderBuilder {
  #customer = null
  #items = []

  withCustomer({ lastName, firstName, email }) {
    this.#customer = {
      lastName: lastName.trim(),
      firstName: firstName.trim(),
      email: email.trim(),
    }
    return this
  }

  addItem({ productId, quantity }) {
    this.#items.push({ productId, quantity })
    return this
  }

  build() {
    if (!this.#customer || this.#items.length === 0) {
      throw new Error('Cannot build an incomplete order.')
    }
    return {
      ...this.#customer,
      items: this.#items.map((item) => ({ ...item })),
    }
  }
}
