import React from "react";
import {
  LiaAngleDoubleLeftSolid,
  LiaAngleDoubleRightSolid,
} from "react-icons/lia";
import { MdEdit } from "react-icons/md";
import { TbArrowBigRightLines } from "react-icons/tb";
import { Link } from "react-router-dom";
import SliderSlick from "react-slick";

import { useWidthWindow } from "@/hooks/useWindowWidth";

import { CardMode } from "@/types/products";

import type { Settings } from "react-slick";
import type { ArrowProps } from "./banners/BannerCarrossel.tsx";

import ProductCard from "./ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/style/components/layout/CarrosselOffers.css";
import "@/style/responsive/components/layout/CarrosselOffers.responsive.css";

const Slider = SliderSlick as Settings as React.ElementType;

interface CarrosselOffersProps {
  titleHidden: boolean;
  className?: string;
  ariaLabel: string;
  title: string;
  icon: React.ReactNode;
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  autoplay: boolean;
  autoplaySpeed: number;
  pauseOnHover: boolean;
  cardPreviewMode: CardMode.PORTRAIT | CardMode.LANDSCAPE;
  button: boolean;
  cart?: boolean;
}

const products = [
  {
    id: 0,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 1,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 2,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 3,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 4,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 5,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 6,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 7,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 8,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 9,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: null,
    price: 999.99,
    alt: "imagem do produto",
  },
];

const SamplePrevArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        zIndex: "20",
      }}
      onClick={onClick}
    >
      <LiaAngleDoubleLeftSolid size={40} color="#000" />
    </div>
  );
};
const SampleNextArrow = (props: ArrowProps) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        zIndex: "20",
      }}
      onClick={onClick}
    >
      <LiaAngleDoubleRightSolid size={40} color="#000" />
    </div>
  );
};

const CarrosselOffers = ({
  titleHidden,
  className,
  ariaLabel,
  title,
  icon,
  dots,
  infinite,
  speed,
  slidesToShow,
  slidesToScroll,
  autoplay,
  autoplaySpeed,
  pauseOnHover,
  cardPreviewMode,
  button,
  cart = false,
}: CarrosselOffersProps) => {
  let widthWindow = useWidthWindow();
  const settings = {
    dots: dots,
    infinite: infinite,
    speed: speed,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    autoplay: autoplay,
    autoplaySpeed: autoplaySpeed,
    pauseOnHover: pauseOnHover,
    nextArrow: widthWindow <= 650 ? "" : <SampleNextArrow />,
    prevArrow: widthWindow <= 650 ? "" : <SamplePrevArrow />,
  };

  let mediaQuery = 40;

  if (widthWindow <= 768 && widthWindow > 650) {
    mediaQuery = 25;
  }

  if (widthWindow <= 650) {
    mediaQuery = 20;
  }

  return (
    <>
      {products && products.length > 0 && (
        <div
          className={`offers-${className} ${autoplay ? "automated" : ""}`}
          aria-label={ariaLabel}
        >
          <div className={`title-${className} ${titleHidden ? "hidden" : ""}`}>
            <div className="header">
              <h2>
                {icon} {title}
              </h2>
              <Link className="link" to={`/departments/${className}`}>
                Ver mais <TbArrowBigRightLines />
              </Link>
            </div>
            <span className="edit-adm">
              <MdEdit fill="#fff" size={mediaQuery} />
            </span>
          </div>
          <div className={`products-${className}`}>
            <Slider {...settings}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  mode={cardPreviewMode}
                  id={product.id}
                  name={product.name}
                  img={product.img}
                  alt={product.alt}
                  prevPrice={product.prevPrice}
                  price={product.price}
                  button={button}
                  cart={cart}
                />
              ))}
            </Slider>
          </div>
        </div>
      )}
    </>
  );
};

export default CarrosselOffers;
