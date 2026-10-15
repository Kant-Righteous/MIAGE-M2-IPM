export function validateOrderItems(products, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, reason: 'empty-order' }
  }

  const selectedProductIds = new Set()

  for (const item of items) {
    if (!item || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { valid: false, reason: 'invalid-quantity' }
    }

    const product = products.find(({ id }) => id === item.productId)
    if (!product) {
      return { valid: false, reason: 'unknown-product', productId: item.productId }
    }

    if (selectedProductIds.has(product.id)) {
      return { valid: false, reason: 'duplicate-product', productId: product.id }
    }

    if (item.quantity > product.quantity) {
      return {
        valid: false,
        reason: 'insufficient-stock',
        productId: product.id,
        available: product.quantity,
      }
    }

    selectedProductIds.add(product.id)
  }

  return { valid: true }
}

export function deductOrderStock(products, items) {
  const validation = validateOrderItems(products, items)
  if (!validation.valid) {
    return validation
  }

  const quantities = new Map(items.map(({ productId, quantity }) => [productId, quantity]))

  return {
    valid: true,
    products: products.map((product) => {
      const orderedQuantity = quantities.get(product.id)
      return orderedQuantity === undefined
        ? product
        : { ...product, quantity: product.quantity - orderedQuantity }
    }),
  }
}

export function placeOrder(products, draft) {
  if (!draft || typeof draft.lastName !== 'string' || typeof draft.firstName !== 'string') {
    return { valid: false, reason: 'invalid-customer' }
  }

  const lastName = draft.lastName.trim()
  const firstName = draft.firstName.trim()
  if (!lastName || !firstName) {
    return { valid: false, reason: 'invalid-customer' }
  }

  const email = typeof draft.email === 'string' ? draft.email.trim() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, reason: 'invalid-email' }
  }

  const stockResult = deductOrderStock(products, draft.items)
  if (!stockResult.valid) {
    return stockResult
  }

  return {
    valid: true,
    products: stockResult.products,
    order: {
      lastName,
      firstName,
      email,
      items: draft.items.map(({ productId, quantity }) => ({ productId, quantity })),
    },
  }
}
