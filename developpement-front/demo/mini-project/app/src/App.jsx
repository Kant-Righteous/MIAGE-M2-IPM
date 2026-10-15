import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import initialProducts from './model/products.json'
import { placeOrder } from './model/orderModel.js'
import { filterProducts, getCategoryStats } from './model/productModel.js'
import HomePage from './pages/HomePage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import './App.css'

function App() {
  const [products, setProducts] = useState(initialProducts)
  const [orders, setOrders] = useState([])
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

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handlePlaceOrder = (draft) => {
    const result = placeOrder(products, draft)
    if (result.valid) {
      setProducts(result.products)
      setOrders((current) => [...current, result.order])
    }
    return result
  }

  return (
    <>
      <nav aria-label="Navigation principale">
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
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
        <Route path="/orders" element={<OrdersPage products={products} onPlaceOrder={handlePlaceOrder} />} />
      </Routes>
    </>
  )
}

export default App
