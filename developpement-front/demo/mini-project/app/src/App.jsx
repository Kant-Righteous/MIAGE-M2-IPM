import { Link, Route, Routes } from 'react-router-dom'
import { useShopController } from './controller/useShopController.js'
import HomePage from './pages/HomePage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import './App.css'

function App() {
  const {
    products,
    orderCount,
    filters,
    categoryStats,
    filteredProducts,
    handleFilterChange,
    handlePlaceOrder,
  } = useShopController()

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
        <Route path="/" element={<HomePage categoryStats={categoryStats} orderCount={orderCount} />} />
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
