import SearchBar from '../components/searchbar/SearchBar.jsx'
import TableProduct from '../components/product/TableProduct.jsx'

function ProductsPage({ products, categories, filters, onFilterChange, onRestoreProducts }) {
  return (
    <main>
      <h1>Produits</h1>
      <SearchBar
        categories={categories}
        filters={filters}
        onFilterChange={onFilterChange}
      />
      <TableProduct products={products} />
      <button type="button" onClick={onRestoreProducts}>Restaurer les produits d'origine</button>
    </main>
  )
}

export default ProductsPage
