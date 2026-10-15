import { useState, useSyncExternalStore } from 'react'
import { getAvailableProducts } from '../model/productModel.js'
import { OrderSubmission } from './OrderSubmission.js'

export function useOrderController(products, onPlaceOrder) {
  const [customer, setCustomer] = useState({ lastName: '', firstName: '', email: '' })
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [submission] = useState(() => new OrderSubmission())
  const { status, result } = useSyncExternalStore(submission.subscribe, submission.getSnapshot)

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
    submission.edit()
  }

  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item
      return field === 'productId'
        ? { ...item, productId: value, quantity: 1 }
        : { ...item, [field]: value }
    }))
    submission.edit()
  }

  const addItem = () => {
    setItems((current) => [...current, { productId: '', quantity: 1 }])
    submission.edit()
  }

  const removeItem = (index) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
    submission.edit()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const outcome = submission.submit({
      ...customer,
      items: items.map(({ productId, quantity }) => ({ productId, quantity: Number(quantity) })),
    }, onPlaceOrder)

    if (outcome.valid) {
      setCustomer({ lastName: '', firstName: '', email: '' })
      setItems([{ productId: '', quantity: 1 }])
    }
  }

  return {
    customer,
    items,
    feedback: status === 'editing' ? null : result,
    availableProducts: getAvailableProducts(products),
    selectedProductIds: new Set(items.map((item) => item.productId)),
    updateCustomer,
    updateItem,
    addItem,
    removeItem,
    handleSubmit,
  }
}
