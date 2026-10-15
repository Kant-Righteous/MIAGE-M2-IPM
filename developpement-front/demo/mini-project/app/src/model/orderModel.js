export function validateOrderItems(products, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { valid: false, reason: 'empty-order' }
  }

  const requestedQuantities = new Map()

  for (const item of items) {
    if (!item || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      return { valid: false, reason: 'invalid-quantity' }
    }

    const product = products.find(({ id }) => id === item.productId)
    if (!product) {
      return { valid: false, reason: 'unknown-product', productId: item.productId }
    }

    const requested = (requestedQuantities.get(product.id) ?? 0) + item.quantity
    if (requested > product.quantity) {
      return {
        valid: false,
        reason: 'insufficient-stock',
        productId: product.id,
        available: product.quantity,
      }
    }

    requestedQuantities.set(product.id, requested)
  }

  return { valid: true }
}
