import SearchBar from '../components/searchbar/SearchBar.jsx'
import TableProduct from '../components/product/TableProduct.jsx'

function ProductsPage({ products, categories, filters, onFilterChange }) {
  return (
    <main>
      <h1>Produits</h1>
      <SearchBar
        categories={categories}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <TableProduct products={products} />
    </main>
  )
}

export default ProductsPage
