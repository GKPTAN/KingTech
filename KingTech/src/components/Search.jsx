import { useState } from "react";
import { MdOutlineSearch } from 'react-icons/md'

const Search = () => {

    const [search, setSearch] = useState("");

  return (
    <form className="search" action="">
        <input 
            type="text"
            placeholder="Pesquise aqui"
            value={search}
        />
        <button className="button" type="submit">
            <MdOutlineSearch />
        </button>
    </form>
  );
};

export default Search