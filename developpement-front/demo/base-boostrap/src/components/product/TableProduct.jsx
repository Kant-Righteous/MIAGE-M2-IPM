import TableCategory from "./TableCategory";

export default function TableProduct({ products }) {
    const row = [];
    products.list.map((category) => {
        row.push(
            <TableCategory key={category.category} categoryWithProducts={category} />
        );
    });

    return (
        <table className="products-table">
            <thead>
                <tr>
                    <th>Catégorie</th>
                    <th>Nom</th>
                    <th>Prix</th>
                </tr>
            </thead>
            <tbody>
                {row}
            </tbody>
        </table>
    );
}