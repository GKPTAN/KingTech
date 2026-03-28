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

export interface Product {
  brand: string;
  rating: number;
  numberRating: number;
  compositionRating: {
    [key: number]: number;
  }
  img: string | string[];
  name: string;
  code: string;
  variations?: {
    category: string;
    options: string[];
  }[];
  mainInformations?: {
    id: number;
    title: string;
    information: string;
  }[];
  texts?: {
    category?: string;
    title: string;
    text?: string;
    imgLg?: string;
    imgSm?: string;
  }[];
  typeDelivery?: string;
  prevPrice?: number | null;
  descount?: string;
  priceInCardStore?: number;
  pricePartInCardStore?: number;
  discountPix: string;
  pricePix: number;
  stock: boolean;
  specs?: {
    [key: string]: string;
  }
  reviewComments?: {
    id: number;
    name: string;
    date: string;
    verified: boolean;
    rating: number;
    comment?: string;
  }[];
}

// departamentos
export interface DepartmentsData {
  [key: string]: {
    id: number;
    subcategories: {
      id: number;
      name: string;
      slug: string;
    }[];
  }
}

export interface CategoryFilters {
  departments: string | string[];
  childrens: {
    category: string;
    filters: {
      id: number;
      rowData: string;
      name: string;
    }[];
  }[];
}