import RowProduct from './RowProduct.jsx'

function TableProduct({ products }) {
  return (
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
          <RowProduct key={product.id} product={product} />
        ))}
      </tbody>
    </table>
  )
}

export default TableProduct
