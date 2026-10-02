export function RowProduct({ product }) {
  return (
    <tr className={product.stock ? undefined : "out-of-stock"}>
      <td></td>
      <td>{product.name}</td>
      <td>{product.price.toFixed(2)}</td>
    </tr>
  );
}