function SearchBar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div>
      <label htmlFor="category-filter">Catégorie</label>
      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  )
}

export default SearchBar
