import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import products from './model/products.json'
import { filterProducts, getCategoryStats } from './model/productModel.js'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import './App.css'

function App() {
  const [orders] = useState([])
  const [filters, setFilters] = useState({ category: '', name: '', minPrice: '', maxPrice: '' })
  const categoryStats = getCategoryStats(products)
  const filteredProducts = filterProducts(products, filters)

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <>
      <nav aria-label="Navigation principale">
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/products">Produits</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage categoryStats={categoryStats} orderCount={orders.length} />} />
        <Route
          path="/products"
          element={
            <ProductsPage
              products={filteredProducts}
              categories={Object.keys(categoryStats)}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
