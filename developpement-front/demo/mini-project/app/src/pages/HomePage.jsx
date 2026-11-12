function HomePage({ categoryStats, orderCount }) {
  return (
    <main>
      <h1>Accueil</h1>
      <section aria-labelledby="category-stats-title">
        <h2 id="category-stats-title">Stock par catégorie</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Catégorie</th>
              <th scope="col">Produits</th>
              <th scope="col">Stock moyen</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categoryStats).map(([category, stats]) => (
              <tr key={category}>
                <th scope="row">{category}</th>
                <td>{stats.productCount}</td>
                <td>{stats.averageStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section aria-labelledby="orders-title">
        <h2 id="orders-title">Commandes passées</h2>
        <p>{orderCount}</p>
      </section>
    </main>
  )
}

export default HomePage
