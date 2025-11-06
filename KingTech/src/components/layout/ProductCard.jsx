import { TbCrown } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import Rating from "@mui/material/Rating";
import HeartFavorite from './HeartFavorite';
import Button from './Button';

/**
 * @typedef {"portrait" | "landscape" | "list"} CardMode
 */
/**
 * @param {{mode?: CardMode}} props  
 */
const ProductCard = ({mode, name, id, img, price, alt, prevPrice, button, cart}) => {
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