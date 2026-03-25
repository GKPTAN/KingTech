export interface ProductsInCart {
  id: string | number;
  name: string;
  img: string;
  prevPrice?: number;
  price: number;
  pricePix: number;
  priceCard: number;
  alt: string;
  brand: string;
  code: string;
  tags: string[];
}