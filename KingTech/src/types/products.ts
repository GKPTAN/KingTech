import type { Department, Subcategory } from "@/data/departmentsData";
import type { Variant } from "@/components/layout/form/Variants";
import type { UploadedFile } from "@/components/layout/form/ImageUploader";
import type { MainInfo } from "@/components/layout/form/MainInformation";

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
  id: string;
  brand: string;
  name: string;
  code: string;
  quantity: number;
  rating: number;
  number_rating: number;
  composition_rating: {
    [key: number]: number;
  }
  section: {
    department: Department,
    subcategory: Subcategory,
  }
  tags: string[];
  img: string[];
  variations?: {
    category: string;
    options: string[];
  }[];
  main_informations?: {
    id: number;
    title: string;
    information: string;
  }[];
  content?: {
    layout_type: string;
    category?: string;
    title: string;
    text?: string;
    imgLg?: string;
    imgSm?: string;
  }[];
  typeDelivery?: string;
  prev_price?: number | null;
  descount?: string;
  price_in_card_store?: number;
  price_part_in_card_store?: number;
  discount_pix: string;
  price_pix: number;
  specs?: {
    [key: string]: string;
  }
  review_comments?: {
    id: number;
    name: string;
    date: string;
    verified: boolean;
    rating: number;
    comment?: string;
  }[];
}

export interface CreateProduct {
  brand: string;
  name: string;
  code: string;
  quantity: number;
  prev_price?: number | null;
  descount?: number | null;
  price_in_card_store: number | null;
  price_part_in_card_store: number | null;
  price_pix: number | null;
  descount_pix?: number | null;
  department: Department;
  subcategory: Subcategory;
  tags: string[];
  images: UploadedFile[] | string[];
  variants: Variant[];
  main_informations: MainInfo[];
  specs: {
    [key: string]: string;
  };
}

export interface UploadImageResponse {
  urls: string[];
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

// Product Card

export enum CardMode {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
  LIST = "list",
}

