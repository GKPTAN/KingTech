/* eslint-disable no-unused-vars */
import { useState } from "react";

import Select from "@/components/layout/form/Select.tsx";

interface ReviewFiltersProps {
  onFilterChange: (value: string) => void;
}

const options = [
  {value: "recent", label: "Mais recentes"},
  {value: "high", label: "Maior nota"},
  {value: "low", label: "Menor nota"},
]

const ReviewFilters = ({ onFilterChange }: ReviewFiltersProps) => {
  const [selected, setSelected] = useState("recent");

  const handleChange = (value: string) => {
    setSelected(value);
    onFilterChange(value);
  };

  return (
    <div className="filters-wrapper">
      <label htmlFor="review-filter">Ordenar por:</label>
      <Select 
        id="review-filter"
        nameDefault={options.find((opt) => opt.value === selected)?.label || "Mais recentes"}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
};

export default ReviewFilters