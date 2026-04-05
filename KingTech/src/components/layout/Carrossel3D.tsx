import { Autoplay, EffectCoverflow, EffectCube, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductCard from './ProductCard.tsx';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "@/style/components/layout/Carrossel3D.css";

interface Carrossel3DProps {
    products: {
        id: string | number;
        name: string;
        img: string;
        alt: string;
        price: number;
        prevPrice: number;
    }[];
    settings: {};
}

const Carrossel3D = ({products = [], settings = {},}: Carrossel3DProps) => {
    
  return (
    <Swiper modules={[EffectCube, EffectCoverflow, Autoplay, Pagination]} {...settings} className='mySwiper'>
        {products.map((product, index) => (
            <SwiperSlide key={index}>
                <ProductCard 
                    mode='portrait'
                    id={product.id}
                    name={product.name}
                    img={product.img}
                    alt={product.alt}
                    price={product.price}
                    prevPrice={product.prevPrice}
                />
            </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default Carrossel3D