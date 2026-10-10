import SearchBar from '../components/searchbar/SearchBar.jsx'
import TableProduct from '../components/product/TableProduct.jsx'

function ProductsPage({ products, categories, selectedCategory, onCategoryChange }) {
  return (
    <main>
      <h1>Produits</h1>
      <SearchBar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      <TableProduct products={products} />
    </main>
  )
}

export default ProductsPage
