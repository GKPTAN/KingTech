import { useState } from "react";

const ProductVariants = ({variants}) => {
  const [selected, setSelected] = useState(Array(variants.length).fill(null));

  const handleSelect = (catIdx, optIdx) => {
    const updated = [...selected];
    updated[catIdx] = optIdx;
    setSelected(updated);
  };

  return (
    <div className='product-variants'>
      {variants.map((variant, catIdx) => (
        <div className='variants' key={catIdx}>
          <h3>{variant.category}</h3>
          <ul className='list-variants'>
            {variant.options.map((option, optIdx) => (
              <li className={selected[catIdx] === optIdx ? 'active' : ''} key={optIdx} onClick={() => handleSelect(catIdx, optIdx)}>{option}</li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ProductVariants