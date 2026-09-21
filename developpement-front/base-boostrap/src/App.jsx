import { useState } from "react";
import { SearchBar } from "./components/searchbar/SearchBar";
import TableProduct from "./components/product/TableProduct";
import "./App.css";

const products = [
  { category: "Fruit", name: "Banane", price: 2.4, stock: false },
  { category: "Légume", name: "Carotte", price: 1.2, stock: true },
  { category: "Fruit", name: "Pomme", price: 1.6, stock: true },
  { category: "Boisson", name: "Limonade", price: 1.8, stock: true },
  { category: "Fruit", name: "Cerise", price: 3.4, stock: true },
  { category: "Légume", name: "Chou", price: 4.5, stock: true },
  { category: "Légume", name: "Célerie", price: 2.9, stock: false },
  { category: "Fruit", name: "Kiwi", price: 4.55, stock: true },
  { category: "Boisson", name: "Eau", price: 0.2, stock: true },
];

function App() {
  const maxPrice = Math.max(...products.map((product) => product.price));
  const [displayStock, setDisplayStock] = useState(false);
  const [searchPattern, setSearchPattern] = useState("");
  const [filterPrice, setFilterPrice] = useState(maxPrice);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchPattern.toLowerCase());
    const matchesStock = !displayStock || product.stock;
    const matchesPrice = product.price <= filterPrice;

    return matchesSearch && matchesStock && matchesPrice;
  });

  const productsByCategory = filteredProducts.reduce((categories, product) => {
    if (!categories[product.category]) {
      categories[product.category] = {
        category: product.category,
        list: [],
      };
    }
    categories[product.category].list.push(product);
    return categories;
  }, {});

  return (
    <main className="container-fluid product-page py-2">
      <h1 className="page-title">Gestion de produits</h1>
      <div className="product-layout">
        <aside className="filters-panel">
          <h2>Recherche et Filtres</h2>
          <SearchBar
            search={searchPattern}
            displayStock={displayStock}
            filterPrice={filterPrice}
            maxPrice={maxPrice}
            searchChange={setSearchPattern}
            displayStockChange={setDisplayStock}
            filterPriceChange={setFilterPrice}
          />
        </aside>
        <section className="products-panel">
          <TableProduct products={{ list: Object.values(productsByCategory) }} />
        </section>
      </div>
    </main>
  );
}

export default App;
