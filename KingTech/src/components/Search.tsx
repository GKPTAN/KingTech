/* eslint-disable no-unused-vars */
import React from "react";
import { useState } from "react";
import { MdOutlineSearch } from 'react-icons/md';

interface SearchProps {
  onSearchChange?: (search: string) => void;
  onSearchSubmit?: (search: string) => void;
  name?: string;
  id?: string;
  value?: string | undefined;
  text?: string;
  button?: boolean;
  asForm?: boolean;
  disabled?: boolean;
  required?: boolean;
  suggestions?: string[];
}

const Search = ({
  onSearchChange, 
  onSearchSubmit, 
  name,
  id,
  text = "Pesquise aqui", 
  button = true, 
  asForm = true,
  value,
  disabled = false,
  required = false,
  suggestions
}: SearchProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
      setIsOpen(true);
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(search);
  };

  const handleSelect = (sug: string) => {
    if (onSearchChange) onSearchChange(sug);
    setSearch(sug);
    setIsOpen(false);
  }

  const Tag = asForm ? "form" : "div" as React.ElementType;

  return (
    <Tag className="search" id={id} onSubmit={asForm ? handleSubmit : undefined}>
        <input 
            type="text"
            name={name}
            id={id}
            placeholder={text}
            value={value !== undefined ? value : search}
            onChange={handleChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && !asForm && e.preventDefault()}
            disabled={disabled}
            required={required}
        />

        <ul className={`suggestions ${suggestions && isOpen && suggestions.length > 0 ? "open" : ""}`}>
          {suggestions && suggestions.map((sug, index) => (
            <li key={index} className="suggestion" onMouseDown={() => handleSelect(sug)}>{sug}</li>
          ))}
        </ul>

        {button && 
          <button className="button" type={asForm ? "submit" : "button"} onClick={!asForm ? handleSubmit : undefined}>
              <MdOutlineSearch />
          </button>
        }
    </Tag>
  );
};

export default Search