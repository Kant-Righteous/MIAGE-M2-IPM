export function filterProducts(products, { category, name = '', minPrice = '', maxPrice = '' }) {
  const searchName = name.trim().toLocaleLowerCase()
  const minimumPrice = minPrice === '' ? null : Number(minPrice)
  const maximumPrice = maxPrice === '' ? null : Number(maxPrice)

  return products.filter((product) =>
    (!category || product.category === category) &&
    product.name.toLocaleLowerCase().includes(searchName) &&
    (minimumPrice === null || product.price >= minimumPrice) &&
    (maximumPrice === null || product.price <= maximumPrice)
  )
}
