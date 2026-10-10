import { isLowStock } from '../model/productStock.js'

function ProductsPage({ products }) {
  return (
    <main>
      <h1>Produits</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Catégorie</th>
            <th scope="col">Prix</th>
            <th scope="col">Quantité</th>
            <th scope="col">Seuil de réapprovisionnement</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={isLowStock(product) ? 'low-stock' : ''}>
              <th scope="row">{product.name}</th>
              <td>{product.category}</td>
              <td>{product.price} €</td>
              <td>{product.quantity}</td>
              <td>{product.restockThreshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

export default ProductsPage
