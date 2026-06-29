function SearchBar({
  value,
  onChange,
  placeholder,
  autoFocus = false,
}) {
  return (
    <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default SearchBar