import { isLowStock } from '../../model/productStock.js'

function RowProduct({ product }) {
  return (
    <tr className={isLowStock(product) ? 'low-stock' : ''}>
      <th scope="row">{product.name}</th>
      <td>{product.category}</td>
      <td>{product.price} €</td>
      <td>{product.quantity}</td>
      <td>{product.restockThreshold}</td>
    </tr>
  )
}

export default RowProduct
