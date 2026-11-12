export class OrderItemsValidator {
  validate(products, draft) {
    if (!Array.isArray(draft?.items) || draft.items.length === 0) {
      return { valid: false, reason: 'empty-order' }
    }

    for (const item of draft.items) {
      if (!item || !Number.isInteger(item.quantity) || item.quantity <= 0) {
        return { valid: false, reason: 'invalid-quantity' }
      }
      if (!products.some((product) => product.id === item.productId)) {
        return { valid: false, reason: 'unknown-product', productId: item.productId }
      }
    }
    return { valid: true }
  }
}

export class OrderValidatorDecorator {
  #validator

  constructor(validator) {
    this.#validator = validator
  }

  validate(products, draft) {
    return this.#validator.validate(products, draft)
  }
}

export class UniqueProductsDecorator extends OrderValidatorDecorator {
  validate(products, draft) {
    const validation = super.validate(products, draft)
    if (!validation.valid) return validation

    const selectedProductIds = new Set()
    for (const { productId } of draft.items) {
      if (selectedProductIds.has(productId)) {
        return { valid: false, reason: 'duplicate-product', productId }
      }
      selectedProductIds.add(productId)
    }
    return validation
  }
}

export class StockValidationDecorator extends OrderValidatorDecorator {
  validate(products, draft) {
    const validation = super.validate(products, draft)
    if (!validation.valid) return validation

    for (const item of draft.items) {
      const product = products.find(({ id }) => id === item.productId)
      if (item.quantity > product.quantity) {
        return {
          valid: false,
          reason: 'insufficient-stock',
          productId: product.id,
          available: product.quantity,
        }
      }
    }
    return validation
  }
}

export class CustomerValidationDecorator extends OrderValidatorDecorator {
  validate(products, draft) {
    if (!draft || typeof draft.lastName !== 'string' || typeof draft.firstName !== 'string') {
      return { valid: false, reason: 'invalid-customer' }
    }
    if (!draft.lastName.trim() || !draft.firstName.trim()) {
      return { valid: false, reason: 'invalid-customer' }
    }
    const email = typeof draft.email === 'string' ? draft.email.trim() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { valid: false, reason: 'invalid-email' }
    }
    return super.validate(products, draft)
  }
}
