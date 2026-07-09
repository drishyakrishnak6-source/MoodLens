import React from "react";

const FilterBar = ({ filter, setFilter }) => {
  return (
    <select
      className="filter-select"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    >
      <option value="All">All Moods</option>
      <option value="Positive">😊 Positive</option>
      <option value="Negative">😔 Negative</option>
      <option value="Neutral">😐 Neutral</option>
    </select>
  );
};

export default FilterBar;