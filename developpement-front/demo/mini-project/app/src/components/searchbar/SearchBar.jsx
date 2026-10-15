function SearchBar({ categories, filters, onFilterChange }) {
  return (
    <div>
      <label htmlFor="name-filter">Nom</label>
      <input
        id="name-filter"
        type="search"
        value={filters.name}
        onChange={(event) => onFilterChange('name', event.target.value)}
      />
      <label htmlFor="category-filter">Catégorie</label>
      <select
        id="category-filter"
        value={filters.category}
        onChange={(event) => onFilterChange('category', event.target.value)}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <label htmlFor="min-price-filter">Prix min (€)</label>
      <input
        id="min-price-filter"
        type="number"
        min="0"
        step="any"
        value={filters.minPrice}
        onChange={(event) => onFilterChange('minPrice', event.target.value)}
      />
      <label htmlFor="max-price-filter">Prix max (€)</label>
      <input
        id="max-price-filter"
        type="number"
        min="0"
        step="any"
        value={filters.maxPrice}
        onChange={(event) => onFilterChange('maxPrice', event.target.value)}
      />
      <label htmlFor="min-quantity-filter">Stock min</label>
      <input
        id="min-quantity-filter"
        type="number"
        min="0"
        step="1"
        value={filters.minQuantity}
        onChange={(event) => onFilterChange('minQuantity', event.target.value)}
      />
      <label htmlFor="max-quantity-filter">Stock max</label>
      <input
        id="max-quantity-filter"
        type="number"
        min="0"
        step="1"
        value={filters.maxQuantity}
        onChange={(event) => onFilterChange('maxQuantity', event.target.value)}
      />
      <label htmlFor="min-threshold-filter">Seuil de réapprovisionnement min</label>
      <input
        id="min-threshold-filter"
        type="number"
        min="0"
        step="1"
        value={filters.minRestockThreshold}
        onChange={(event) => onFilterChange('minRestockThreshold', event.target.value)}
      />
      <label htmlFor="max-threshold-filter">Seuil de réapprovisionnement max</label>
      <input
        id="max-threshold-filter"
        type="number"
        min="0"
        step="1"
        value={filters.maxRestockThreshold}
        onChange={(event) => onFilterChange('maxRestockThreshold', event.target.value)}
      />
    </div>
  )
}

export default SearchBar
