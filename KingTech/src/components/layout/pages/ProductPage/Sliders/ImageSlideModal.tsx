import { useState, useRef } from "react";
import { RiShoppingBasketFill, RiCloseFill } from "react-icons/ri";
import { Swiper, SwiperSlide, type SwiperClass } from 'swiper/react';
import { Pagination, EffectCoverflow } from "swiper/modules";
import { useWidthWindow } from "../../../../../hooks/useWindowWidth.tsx";
import Button from "../../../Button.tsx";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

interface ImageSlideModalProps {
  images: string[];
  onClose: () => void;
  price: number;
  alt: string;
}

const ImageSlideModal = ({ images, onClose, price, alt }: ImageSlideModalProps) => {
  const [image, setImage] = useState(0);
  let widthWindow = useWidthWindow();
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="slider-modal">
      <Button 
        type="button"
        nameAction=""
        className="btn-close-modal"
        disabled={false}
        onClick={onClose}
        icon={<RiCloseFill size={40} fill="#f9cb40"/>}
      />
      <div className="vertical-images-modal">
        {images.map((src, idx) => (
          <img
            key={idx}
            className={image === idx ? "active" : ""}
            src={src}
            alt={`Produto imagem ${idx + 1}`}
            onClick={() => {
              setImage(idx);
              if (swiperRef.current) {
                swiperRef.current.slideTo(idx);
              };
            }}
          />
        ))}
      </div>
      <div className="info-slide">
        <span className="progress-slide">{image + 1}/{images.length}</span>
        <span className="price-product">R$ {price.toLocaleString("pt-BR", {minimumFractionDigits: 2})}</span>
        <Button 
          type="button"
          nameAction="Adicionar à cesta"
          className="btn-add-to-cart"
          disabled={false}
          onClick={() => {}}
          icon={<RiShoppingBasketFill size={widthWindow > 425 ? 30 : 20} />}
        />
      </div>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        onSwiper={(swiper) => { swiperRef.current = swiper}}
        onSlideChange={(swiper) => setImage(swiper.activeIndex)}
        initialSlide={image}
        className="mySwiper"
      >
        {images.map((src, idx) => (
          <SwiperSlide key={idx} title="Arraste para o lado para mudar a imagem">
            <img src={src} alt={`${alt} - arraste para mudar a imagem`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlideModal;
