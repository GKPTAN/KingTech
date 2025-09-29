import { useState } from "react";
import { MdOutlineSearch } from 'react-icons/md'

const Search = ({onSearchChange}) => {

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="search" onSubmit={handleSubmit}>
        <input 
            type="text"
            placeholder="Pesquise aqui"
            value={search}
            onChange={handleChange}
        />
        <button className="button" type="submit">
            <MdOutlineSearch />
        </button>
    </form>
  );
};

export default Search