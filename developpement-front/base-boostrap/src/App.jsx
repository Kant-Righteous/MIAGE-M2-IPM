import { useState } from "react";
import SearchBar from "./components/searchbar/SearchBar";

const products = [
  { name: "Produit 1", price: 2.5 },
  { name: "Produit 2", price: 4.55 },
  { name: "Produit 3", price: 3.2 },
];

function App() {
  const maxPrice = Math.max(...products.map((product) => product.price));
  const [searchPattern, setSearchPattern] = useState("");
  const [displayStock, setDisplayStock] = useState(true);
  const [filterPrice, setFilterPrice] = useState(maxPrice);

  return (
    <main className="container py-4">
      <h1 className="mb-4">Recherche et Filtres</h1>
      <SearchBar
        search={searchPattern}
        displayStock={displayStock}
        maxPrice={filterPrice}
        maxPriceLimit={maxPrice}
        searchChange={setSearchPattern}
        displayStockChange={setDisplayStock}
        maxPriceChange={setFilterPrice}
      />
    </main>
  );

}

export default App;
