export function getCategoryStats(products) {
  const totals = {}

  for (const product of products) {
    const category = product.category

    if (!totals[category]) {
      totals[category] = { productCount: 0, totalStock: 0 }
    }

    totals[category].productCount += 1
    totals[category].totalStock += product.quantity
  }

  for (const stats of Object.values(totals)) {
    stats.averageStock = stats.totalStock / stats.productCount
  }

  return totals
}

export function isLowStock(product) {
  return product.quantity < product.restockThreshold
}

export function filterProducts(products, {
  category,
  name = '',
  minPrice = '',
  maxPrice = '',
  minQuantity = '',
  maxQuantity = '',
}) {
  const searchName = name.trim().toLocaleLowerCase()
  const minimumPrice = minPrice === '' ? null : Number(minPrice)
  const maximumPrice = maxPrice === '' ? null : Number(maxPrice)
  const minimumQuantity = minQuantity === '' ? null : Number(minQuantity)
  const maximumQuantity = maxQuantity === '' ? null : Number(maxQuantity)

  return products.filter((product) =>
    (!category || product.category === category) &&
    product.name.toLocaleLowerCase().includes(searchName) &&
    (minimumPrice === null || product.price >= minimumPrice) &&
    (maximumPrice === null || product.price <= maximumPrice) &&
    (minimumQuantity === null || product.quantity >= minimumQuantity) &&
    (maximumQuantity === null || product.quantity <= maximumQuantity)
  )
}
