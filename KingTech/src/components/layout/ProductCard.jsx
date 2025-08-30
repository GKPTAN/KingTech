import { TbCrown } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const ProductCard = ({name, id, img, price, alt, prevPrice}) => {
  const navigate = useNavigate();

  return (
    <div className="product-card" id={`prod-${id}`} onClick={() => navigate(`/product/${id}/${name}`)}>
        <img src={img} alt={alt} />
        <h3 className="name-product">
          <div className='royalty'>
            <span className='line-left'></span>  
            <TbCrown className='crown'/>
            <span className='line-right'></span>  
          </div> 
          {name}
        </h3>
        <p className="prev-price">{prevPrice}</p>
        <p className="price-product">R$ {price}</p>
        <p> 
            Á vista <br />
            ou 10x de R$ {(Math.floor((price / 10) * 100) / 100).toLocaleString("pt-BR", {minimumFractionDigits: 2})} sem juros
        </p>
        <Button 
          type="button"
          nameAction="Compre agora"
          disabled={false}
          onClick={() => {}}
          className="btn-buy"
        />
    </div>
  );
};

export default ProductCard