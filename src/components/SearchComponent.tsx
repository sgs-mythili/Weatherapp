interface SearchBarProps {
  city: string;
  onCityChange: (city: string) => void;
  onSearch: () => void;
}

function SearchBar({city,onCityChange,onSearch,}: SearchBarProps) {
  return (
    <div className="search-container">
      <input
        type="text"
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        placeholder="Enter city name"
        className="search-input"
      />

      <button
        onClick={onSearch}
        className="search-button"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;