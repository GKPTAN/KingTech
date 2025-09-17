const Filter = ({category, filters}) => {
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