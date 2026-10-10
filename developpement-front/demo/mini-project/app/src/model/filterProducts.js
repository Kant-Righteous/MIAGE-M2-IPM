export function filterProducts(products, { category }) {
  return products.filter((product) => !category || product.category === category)
}
