
export function getCategoryStats(products) {
    const totals = {};

    for (const product of products) {
        const category = product.category;

        if (!totals[category]) {
            totals[category] = { productCount: 0, totalStock: 0 };
        }

        totals[category].productCount += 1;
        totals[category].totalStock += product.quantity;
    }

    return totals;
}
