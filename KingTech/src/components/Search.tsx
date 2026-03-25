import { useState, type FormEvent, type ReactEventHandler } from "react";
import { MdOutlineSearch } from 'react-icons/md';

interface SearchProps {
  onSearchChange?: (search: string) => void;
}

const Search = ({onSearchChange}: SearchProps) => {

  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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