import TableProduct from '../components/product/TableProduct.jsx'

function ProductsPage({ products }) {
  return (
    <main>
      <h1>Produits</h1>
      <TableProduct products={products} />
    </main>
  )
}

export default ProductsPage
