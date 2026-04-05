import Rating from "@mui/material/Rating";
import { MdAddShoppingCart } from 'react-icons/md';
import { TbCrown } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import Button from './Button.js';
import HeartFavorite from './HeartFavorite.js';

/**
 * Define o tipo de layout do card, podendo ser modo retrato, paisagem ou lista.
*/
type CardMode = "portrait" | "landscape" | "list";

interface ProductCardProps {
  mode: CardMode;
  name: string;
  id: string | number;
  img: string;
  price: number;
  alt: string;
  prevPrice?: number | null;
  button?: boolean;
  cart?: boolean;
}

/**
 * componente de card de produto, utilizado para exibir os produtos em diferentes seções do site, como home, categorias e carrinho. O componente recebe as seguintes props:
 * @param mode: define o layout do card, podendo ser "portrait", "landscape" ou "list"
 * @param name: nome do produto
 * @param id: id do produto, utilizado para navegação
 * @param img: imagem do produto
 * @param price: preço do produto
 * @param alt: texto alternativo da imagem do produto
 * @param prevPrice: preço anterior do produto, utilizado para exibir o desconto
 * @param button: booleano que define se o botão de compra deve ser exibido
 * @param cart: booleano que define se o card está sendo exibido no carrinho, caso seja true, o botão de compra é substituído por um botão de adicionar ao carrinho
 * @returns TSX.Element
 */
const ProductCard = ({mode, name, id, img, price, alt, prevPrice, button, cart}: ProductCardProps) => {
  const navigate = useNavigate();
  const rating = 4;

  return (
    <div className={`product-card ${mode === "portrait" ? "portrait" : "landscape"}`} id={`prod-${id}`} onClick={() => navigate(`/product/${id}/${name}`)}>
        {mode === "portrait" && (
          <div className="rating-favorite-box" onClick={(e) => e.stopPropagation()}>
            <Rating 
              name={"product-rating"}
              value={rating}
              readOnly={true}
            />
            <HeartFavorite />
          </div>
        )}
        <img src={img} alt={alt} />
        {(mode === "portrait" || mode === "list") && (
          <h3 className="name-product">
            <div className='royalty'>
              <span className='line-left'></span>
                <TbCrown className='crown'/>
              <span className='line-right'></span>
            </div>
            {name}
          </h3>
        )}
        <div className="info-prod">
          {mode === "landscape" && (
            <>
              <div className="rating-favorite-box" onClick={(e) => e.stopPropagation()}>
                <Rating 
                  name={"product-rating"}
                  value={rating}
                  readOnly={true}
                  className='rating-star'
                />
                <HeartFavorite />
              </div>
              <h3 className="name-product">
                <div className='royalty'>
                  <span className='line-left'></span>
                    <TbCrown className='crown'/>
                  <span className='line-right'></span>
                </div>
                {name}
              </h3>
            </>
          )}
          <div>
            {mode === "list" && (
              <div className="rating-favorite-box" onClick={(e) => e.stopPropagation()}>
                <Rating 
                  name={"product-rating"}
                  value={rating}
                  readOnly={true}
                />
                <HeartFavorite />
              </div>
            )}
            <p className="prev-price">{prevPrice}</p>
            <p className="price-product">R$ {price}</p>
            <p>
                Á vista <br />
                ou 10x de R$ {(Math.floor((price / 10) * 100) / 100).toLocaleString("pt-BR", {minimumFractionDigits: 2})} sem juros
            </p>
          </div>
        </div>
        {!cart && (
          <Button 
            type="button"
            nameAction="Compre agora"
            disabled={false}
            onClick={() => {}}
            className={`btn-buy ${!button ? 'hidden' : ""}`}
          />
        )}
        {cart && (
          <Button 
            type="button"
            nameAction={""}
            disabled={false}
            onClick={() => {}}
            className={`btn-add-prod`}
            icon={<MdAddShoppingCart size={20} fill='#F9CB40' />}
          />
        )}
    </div>
  );
};

export default ProductCard