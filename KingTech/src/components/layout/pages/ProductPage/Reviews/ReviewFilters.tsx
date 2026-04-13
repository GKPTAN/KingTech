/* eslint-disable no-unused-vars */
import { useState } from "react";

import { ReviewSortOrder } from "@/types/filters";

import Select from "@/components/layout/form/Select";

interface ReviewFiltersProps {
  onFilterChange: (value: ReviewSortOrder) => void;
}

const options = [
  {value: ReviewSortOrder.RECENT, label: "Mais recentes"},
  {value: ReviewSortOrder.HIGH, label: "Maior nota"},
  {value: ReviewSortOrder.LOW, label: "Menor nota"},
]

const ReviewFilters = ({ onFilterChange }: ReviewFiltersProps) => {
  const [selected, setSelected] = useState<ReviewSortOrder>(ReviewSortOrder.RECENT);

  const handleChange = (value: string | number) => {

    if (typeof value === "number") {
      return;
    }

    const newValue = value as ReviewSortOrder;
    setSelected(newValue);
    onFilterChange(newValue);
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