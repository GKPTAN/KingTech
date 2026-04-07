interface FilterOptions {
  id: number;
  rowData: string;
  name: string;
}

interface FilterProps {
  category: string;
  filters: FilterOptions[];
}

const Filter = ({ category, filters }: FilterProps) => {
  return (
    <div className="filter">
      <h4>{category}</h4>
      <ul className="filter-category-list">
        {category &&
          filters.map((filter) => {
            const uniqueId = `${filter.id}-${filter.name}`;
            return (
              <li key={filter.id}>
                <input
                  type="checkbox"
                  name={filter.rowData}
                  id={uniqueId}
                />
                <label htmlFor={uniqueId}>{filter.name}</label>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Filter;
