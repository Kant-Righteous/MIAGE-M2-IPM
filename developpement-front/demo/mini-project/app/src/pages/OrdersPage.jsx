import { useState } from 'react'

function getOrderErrorMessage(result, products) {
  switch (result.reason) {
    case 'invalid-customer':
      return 'Renseignez votre nom et votre prénom.'
    case 'invalid-email':
      return 'Saisissez une adresse e-mail valide.'
    case 'empty-order':
      return 'Ajoutez au moins un produit.'
    case 'invalid-quantity':
      return 'Saisissez une quantité entière supérieure à zéro.'
    case 'unknown-product':
      return 'Sélectionnez un produit disponible.'
    case 'duplicate-product':
      return 'Chaque produit ne peut être sélectionné qu’une fois.'
    case 'insufficient-stock': {
      const product = products.find(({ id }) => id === result.productId)
      return `Stock insuffisant pour ${product?.name ?? 'ce produit'} : ${result.available} disponible(s).`
    }
    default:
      return 'La commande n’a pas pu être enregistrée.'
  }
}

function OrdersPage({ products, onPlaceOrder }) {
  const [customer, setCustomer] = useState({ lastName: '', firstName: '', email: '' })
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const [feedback, setFeedback] = useState(null)
  const availableProducts = products.filter((product) => product.quantity > 0)
  const selectedProductIds = new Set(items.map((item) => item.productId))

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
    setFeedback(null)
  }

  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item
      return field === 'productId'
        ? { ...item, productId: value, quantity: 1 }
        : { ...item, [field]: value }
    }))
    setFeedback(null)
  }

  const addItem = () => {
    setItems((current) => [...current, { productId: '', quantity: 1 }])
    setFeedback(null)
  }

  const removeItem = (index) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
    setFeedback(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const result = onPlaceOrder({
      ...customer,
      items: items.map(({ productId, quantity }) => ({ productId, quantity: Number(quantity) })),
    })

    if (!result.valid) {
      setFeedback({ type: 'error', message: getOrderErrorMessage(result, products) })
      return
    }

    setCustomer({ lastName: '', firstName: '', email: '' })
    setItems([{ productId: '', quantity: 1 }])
    setFeedback({ type: 'success', message: 'Commande enregistrée.' })
  }

  return (
    <main>
      <h1>Commande</h1>
      <form className="order-form" onSubmit={handleSubmit}>
        <section className="order-customer" aria-labelledby="customer-heading">
          <h2 id="customer-heading">Coordonnées</h2>
          <div className="order-field">
            <label htmlFor="last-name">Nom</label>
            <input
              id="last-name"
              name="lastName"
              autoComplete="family-name"
              value={customer.lastName}
              onChange={(event) => updateCustomer('lastName', event.target.value)}
              required
            />
          </div>
          <div className="order-field">
            <label htmlFor="first-name">Prénom</label>
            <input
              id="first-name"
              name="firstName"
              autoComplete="given-name"
              value={customer.firstName}
              onChange={(event) => updateCustomer('firstName', event.target.value)}
              required
            />
          </div>
          <div className="order-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={customer.email}
              onChange={(event) => updateCustomer('email', event.target.value)}
              required
            />
          </div>
        </section>
        <div className="order-details">
          <section className="order-products" aria-labelledby="products-heading">
            <h2 id="products-heading">Produits</h2>
            {items.map((item, index) => {
              const selectedProduct = products.find((product) => product.id === item.productId)

              return (
                <div className="order-item" key={index}>
                  <div className="order-field">
                    <label htmlFor={`product-${index}`}>Produit {index + 1}</label>
                    <select
                      id={`product-${index}`}
                      value={item.productId}
                      onChange={(event) => updateItem(index, 'productId', event.target.value)}
                      required
                    >
                      <option value="">Choisir un produit</option>
                      {availableProducts.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                          disabled={selectedProductIds.has(product.id) && product.id !== item.productId}
                        >
                          {product.name} ({product.quantity} disponibles)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="order-field">
                    <label htmlFor={`quantity-${index}`}>Quantité</label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      max={selectedProduct?.quantity}
                      step="1"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', event.target.value)}
                      required
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      aria-label={`Retirer le produit ${index + 1}`}
                      title={`Retirer le produit ${index + 1}`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                        <path d="M3 6h18M9 6V4h6v2" />
                        <path d="m5 6 1 14h12l1-14M10 10v6M14 10v6" />
                      </svg>
                    </button>
                  )}
                </div>
              )
            })}
            <button
              type="button"
              onClick={addItem}
              disabled={items.length >= availableProducts.length}
            >
              Ajouter un produit
            </button>
          </section>
          {availableProducts.length === 0 && <p>Aucun produit disponible.</p>}
          <div className="order-actions">
            <button type="submit" disabled={availableProducts.length === 0}>
              Valider la commande
            </button>
          </div>
          {feedback && <p role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
        </div>
      </form>
    </main>
  )
}

export default OrdersPage
