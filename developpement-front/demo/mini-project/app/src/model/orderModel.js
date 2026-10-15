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
