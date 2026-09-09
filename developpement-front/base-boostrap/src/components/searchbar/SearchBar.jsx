import Checkbox from "./Checkbox";
import Input from "./Input";
import Range from "./Range";

export default function SearchBar({
	search,
	displayStock,
	maxPrice,
	maxPriceLimit,
	searchChange,
	displayStockChange,
	maxPriceChange,
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
					label="Afficher uniquement les produits en stock"
					checked={displayStock}
					stateChange={displayStockChange}
				/>
			</div>
			<div className="col-12">
				<Range
					label="Prix maximum"
					min={0}
					max={maxPriceLimit}
					value={maxPrice}
					valueChange={maxPriceChange}
				/>
			</div>
		</div>
	);
}

