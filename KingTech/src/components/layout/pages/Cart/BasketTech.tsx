import type { ProductsInCart } from "@/types/products.ts";

import ListProductsCart from "./ListProductsCart.tsx";
import SummaryCart from "./SummaryCart.tsx";

interface BasketTechProps {
  products: ProductsInCart[];
  handleRemove: () => void;
}

const BasketTech = ({products, handleRemove}: BasketTechProps) => {
  return (
    <div className="basket-tech">
        <ListProductsCart
            products={products ?? []}
            remove={handleRemove}
        />
        <SummaryCart 
            products={products ?? []}
        />
    </div>
  );
};

export default BasketTech