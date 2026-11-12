import { useState, useSyncExternalStore } from 'react'
import { ShopStore } from '../model/ShopStore.js'
import { filterProducts, getCategoryStats } from '../model/productModel.js'
import { PlaceOrderCommand } from './PlaceOrderCommand.js'

const shopStore = ShopStore.getInstance()

export function useShopController() {
  const { products, orders } = useSyncExternalStore(shopStore.subscribe, shopStore.getSnapshot)
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

  const handleFilterChange = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handlePlaceOrder = (draft) => new PlaceOrderCommand(shopStore, draft).execute()

  return {
    products,
    orderCount: orders.length,
    filters,
    categoryStats: getCategoryStats(products),
    filteredProducts: filterProducts(products, filters),
    handleFilterChange,
    handlePlaceOrder,
  }
}
