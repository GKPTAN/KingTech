
interface FilterProps {
    category: string;
    filters: {
        id: number;
        rowData: string;
        name: string;
    }[];
}

const Filter = ({category, filters}: FilterProps) => {
  return (
    <div className="filter">
        <h4>{category}</h4>
        <ul className="filter-category-list">
            {category && filters.map((filter) => (
                <li key={filter.id}>
                    <input type="checkbox" name={filter.rowData} id={filter.rowData}/>
                    <label htmlFor={filter.rowData}>{filter.name}</label>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default Filter