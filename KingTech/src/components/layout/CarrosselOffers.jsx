import { TbTopologyStar3, TbArrowBigRightLines } from "react-icons/tb";
import { Link } from "react-router-dom";
import {
  LiaAngleDoubleLeftSolid,
  LiaAngleDoubleRightSolid,
} from "react-icons/lia";
import ProductCard from "./ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../style/components/layout/CarrosselOffers.css";

const products = [
    {
        id: 0,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 1,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 2,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 3,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 4,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 5,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 6,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 7,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 8,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
    {
        id: 9,
        name: "Produto",
        img: "https://placehold.co/150x150/jpg",
        prevPrice: "",
        price: 999.99,
        alt: "imagem do produto"
    },
]

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: "black",
        zIndex: "20" 
    }}
      onClick={onClick}
    >
      <LiaAngleDoubleLeftSolid size={40} color="#000" />
    </div>
  );
};
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        color: "black",
        zIndex: "20" 
    }}
      onClick={onClick}
    >
      <LiaAngleDoubleRightSolid size={40} color="#000" />
    </div>
  );
};

const CarrosselOffers = ({className, ariaLabel, title, icon}) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    }

  return (
    <div className={`offers-${className}`} aria-label={ariaLabel}>
        <div className={`title-${className}`}>
            <h2>{icon} {title}</h2>
            <Link className="link" to={`/departments/${className}`}>Ver mais <TbArrowBigRightLines /></Link>
        </div>
        <div className={`products-${className}`}>
            <Slider {...settings}>
                {products.map((product) => (
                    <ProductCard 
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        img={product.img}
                        alt={product.alt}
                        prevPrice={product.prevPrice}
                        price={product.price}
                    />
                ))}
            </Slider>
        </div>
    </div>
  );
};

export default CarrosselOffers