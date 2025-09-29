import { useState } from "react";
import Select from "../../../form/Select";

const options = [
  {value: "recent", label: "Mais recentes"},
  {value: "high", label: "Maior nota"},
  {value: "low", label: "Menor nota"},
]

const ReviewFilters = ({ onFilterChange }) => {
  const [selected, setSelected] = useState("recent");

  const handleChange = (value) => {
    setSelected(value);
    onFilterChange(value);
  };

  return (
    <div className="filters-wrapper">
      <label htmlFor="review-filter">Ordenar por:</label>
      <Select 
        id="review-filter"
        nameDefault={options.find((opt) => opt.value === selected)?.label}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
};

export default ReviewFilters