import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { Range } from "./Range";

export function SearchBar({
  search,
  displayStock,
  filterPrice,
  maxPrice,
  searchChange,
  displayStockChange,
  filterPriceChange,
}) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-12">
        <Input
          value={search}
          placeholder="Rechercher ..."
          textChange={searchChange}
        />
      </div>
      <div className="col-12">
        <Checkbox
          id="display-stock"
          label="Afficher seulement les produits en stock"
          checked={displayStock}
          stateChange={displayStockChange}
        />
      </div>
      <div className="col-12">
        <Range
          label="Prix max"
          min={0}
          max={maxPrice}
          value={filterPrice}
          valueChange={filterPriceChange}
        />
      </div>
    </div>
  );
}
