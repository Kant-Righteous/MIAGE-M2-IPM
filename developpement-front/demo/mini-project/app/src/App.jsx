import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import products from './model/products.json'
import { filterProducts } from './model/filterProducts.js'
import { getCategoryStats } from './model/productStats.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import './App.css'

function App() {
  const [orders] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchName, setSearchName] = useState('')
  const categoryStats = getCategoryStats(products)
  const filteredProducts = filterProducts(products, { category: selectedCategory, name: searchName })

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
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchName={searchName}
              onNameChange={setSearchName}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App
