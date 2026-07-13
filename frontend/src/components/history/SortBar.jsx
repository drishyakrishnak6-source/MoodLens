const SortBar = ({ sortBy, setSortBy }) => {
  return (
    <select
      className="sort-select"
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
    >
      <option value="Newest">Newest</option>
      <option value="Oldest">Oldest</option>
      <option value="Highest Confidence">
        Highest Confidence
      </option>
      <option value="Lowest Confidence">
        Lowest Confidence
      </option>
    </select>
  );
};

export default SortBar;