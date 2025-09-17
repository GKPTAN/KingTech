import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, EffectCube } from "swiper/modules";
import ProductCard from './ProductCard';
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "../../style/components/layout/Carrossel3D.css";

const Carrossel3D = ({products = [], settings = {},}) => {
    
  return (
    <Swiper modules={[EffectCube, EffectCoverflow, Autoplay, Pagination]} {...settings} className='mySwiper'>
        {products.map((product, index) => (
            <SwiperSlide key={index}>
                <ProductCard 
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