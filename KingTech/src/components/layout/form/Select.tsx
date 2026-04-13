import { useState } from 'react';
import { MdArrowDropDown } from 'react-icons/md';

import Button from '@/components/layout/Button';
import '@/style/components/Select.css';

interface SelectProps {
  id: string;
  options: {
    value: string | number;
    label: string;
  } [];
  nameDefault: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string | number) => void;
}

interface Option {
  value: string | number;
  label: string;
}

const Select = ({id = "", options = [], nameDefault, onChange }: SelectProps) => {

  const [selected, setSelected] = useState(nameDefault);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    setSelected(option.label);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    };
  };

  return (
    <div id={id} className="select" onClick={() => setIsOpen(!isOpen)}>
      <div className='selected'>{selected}</div>
      {isOpen && (
        <ul className="options">
          {options && options.map((option) => (
            <li key={option.value} className='option' onClick={() => handleSelect(option)}>{option.label}</li>
          ))}
        </ul>
      )}
      <Button type="button" className="button-select" nameAction={<MdArrowDropDown fill='#000'/>} disabled={false}/>
    </div>
  );
};

export default Select