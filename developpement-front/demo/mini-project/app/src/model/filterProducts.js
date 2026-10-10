export function filterProducts(products, { category, name = '' }) {
  const searchName = name.trim().toLocaleLowerCase()

  return products.filter((product) =>
    (!category || product.category === category) &&
    product.name.toLocaleLowerCase().includes(searchName)
  )
}
