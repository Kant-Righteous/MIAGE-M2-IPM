function SearchBar({ categories, selectedCategory, onCategoryChange, searchName, onNameChange }) {
  return (
    <div>
      <label htmlFor="name-filter">Nom</label>
      <input
        id="name-filter"
        type="search"
        value={searchName}
        onChange={(event) => onNameChange(event.target.value)}
      />
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
