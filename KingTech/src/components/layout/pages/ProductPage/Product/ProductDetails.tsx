import type { Product } from "@/types/products";

const ProductDetails = ({ product }: {product: Product}) => {
  return (
    <section className="product-details">
      <p>{product.brand}</p>
    </section>
  );
};

export default ProductDetails;
