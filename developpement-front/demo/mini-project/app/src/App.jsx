import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import products from './model/products.json'
import { getCategoryStats } from './model/productStats.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import './App.css'

function App() {
  const [orders] = useState([])
  const categoryStats = getCategoryStats(products)

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
        <Route path="/products" element={<ProductsPage products={products} />} />
      </Routes>
    </>
  )
}

export default App
