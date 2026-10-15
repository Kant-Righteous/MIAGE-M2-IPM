import { useState } from 'react'

function OrdersPage({ products }) {
  const [customer, setCustomer] = useState({ lastName: '', firstName: '', email: '' })
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])
  const availableProducts = products.filter((product) => product.quantity > 0)
  const selectedProductIds = new Set(items.map((item) => item.productId))

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )))
  }

  return (
    <main>
      <h1>Commande</h1>
      <form>
        <div>
          <label htmlFor="last-name">Nom</label>
          <input
            id="last-name"
            name="lastName"
            value={customer.lastName}
            onChange={(event) => updateCustomer('lastName', event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="first-name">Prénom</label>
          <input
            id="first-name"
            name="firstName"
            value={customer.firstName}
            onChange={(event) => updateCustomer('firstName', event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={customer.email}
            onChange={(event) => updateCustomer('email', event.target.value)}
            required
          />
        </div>
        <fieldset>
          <legend>Produits</legend>
          {items.map((item, index) => {
            const selectedProduct = products.find((product) => product.id === item.productId)

            return (
              <div key={index}>
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
                {items.length > 1 && (
                  <button type="button" onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                    Retirer
                  </button>
                )}
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => setItems((current) => [...current, { productId: '', quantity: 1 }])}
            disabled={items.length >= availableProducts.length}
          >
            Ajouter un produit
          </button>
        </fieldset>
      </form>
    </main>
  )
}

export default OrdersPage
