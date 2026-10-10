export function isLowStock(product) {
  return product.quantity < product.restockThreshold
}
