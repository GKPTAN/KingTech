import { useState } from 'react';
import Button from '../Button';
import { MdArrowDropDown } from 'react-icons/md';
import '../../../style/components/Select.css';

const Select = ({id = "", options = [], nameDefault, onChange }) => {

  const [selected, setSelected] = useState(nameDefault);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
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
          {options.map((option) => (
            <li key={option.value} className='option' onClick={() => handleSelect(option)}>{option.label}</li>
          ))}
        </ul>
      )}
      <Button type="button" className="button-select" nameAction={<MdArrowDropDown />}/>
    </div>
  );
};

export default Select