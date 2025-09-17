import ListProductsCart from "./ListProductsCart";
import SummaryCart from "./SummaryCart";

const BasketTech = ({products, handleRemove}) => {
  return (
    <div className="basket-tech">
        <ListProductsCart
            products={products}
            remove={handleRemove}
        />
        <SummaryCart 
            products={products}
        />
    </div>
  );
};

export default BasketTech