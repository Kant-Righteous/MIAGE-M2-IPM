import { RowProduct } from "./RowProduct";

export default function TableCategory({ categoryWithProducts }) {
    const row = [];
    categoryWithProducts.list.forEach((product) => {
        row.push(<RowProduct key={product.name} product={product} />);
    });

    return (
        <>
            <tr className="category-row">
                <th colSpan="3">{categoryWithProducts.category}</th>
            </tr>
            {row}
        </>
    );
}