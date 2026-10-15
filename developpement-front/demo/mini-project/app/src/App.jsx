import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import initialProducts from './model/products.json'
import { filterProducts, getCategoryStats } from './model/productModel.js'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import './App.css'

const PRODUCTS_STORAGE_KEY = 'mini-project-products-v1'

function loadProducts() {
  try {
    const savedProducts = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY))
    return Array.isArray(savedProducts) ? savedProducts : initialProducts
  } catch {
    return initialProducts
  }
}

function App() {
  const [products, setProducts] = useState(loadProducts)
  const [orders] = useState([])
  const [filters, setFilters] = useState({
    category: '',
    name: '',
    minPrice: '',
    maxPrice: '',
    minQuantity: '',
    maxQuantity: '',
    minRestockThreshold: '',
    maxRestockThreshold: '',
  })
  const categoryStats = getCategoryStats(products)
  const filteredProducts = filterProducts(products, filters)

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
    } catch (error) {
      console.warn('Impossible de sauvegarder les produits', error)
    }
  }, [products])

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handleRestoreProducts = () => {
    setProducts(initialProducts.map((product) => ({ ...product })))
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
              onRestoreProducts={handleRestoreProducts}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
