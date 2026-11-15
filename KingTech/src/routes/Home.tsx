import { useState } from "react";
import { TbCrown } from "react-icons/tb";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";

import { useWidthWindow } from "@/hooks/useWindowWidth";

import { useProductService } from "@/services/productService";

import { CardMode } from "@/types/products";

import BannerCarrossel from "@/components/layout/banners/BannerCarrossel";
import CarrosselOffers from "@/components/layout/CarrosselOffers";
import SkeletonSlider from "@/components/layout/loading/SkeletonSlider";

import "@/style/Home.css";
import "@/style/responsive/routes/Home/Home.responsive.css";

const promotionsStore = [
  {
    id: 1,
    title: "Promoção 1",
    description: "Desconto de 20% em todos os produtos",
    src: "/image/banner1.webp",
  },
  {
    id: 2,
    title: "Promoção 2",
    description: "Desconto de 50% em todos os produtos",
    src: "/image/banner2.jpg",
  },
  {
    id: 3,
    title: "Promoção 3",
    description: "Desconto de 70% em todos os produtos",
    src: "/image/banner3.jpg",
  },
];

const promotionOffers = [
  {
    id: 1,
    title: "Samsung Galaxy S21",
    description: "Smartphone com câmera de 108MP",
    price: 2999.99,
    src: "/image/banner1.webp",
  },
  {
    id: 2,
    title: "Iphone 13",
    description: "Smartphone com câmera de 140MP",
    price: 3999.99,
    src: "/image/banner2.jpg",
  },
  {
    id: 3,
    title: "PS5",
    description: "Console de jogos",
    price: 2599.99,
    src: "/image/banner3.jpg",
  },
];

const Home = () => {
  const [promotions, _setPromotions] = useState(promotionsStore);
  const [offersPromo, _setOffersPromo] = useState(promotionOffers);
  let widthWindow = useWidthWindow();

  const slidesToShow = widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5;

  const { getProductsForHome } = useProductService();

  const {
    data: homeProducts,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["home-products"],
    queryFn: async () => {
      const result = await getProductsForHome();

      if (result.error) {
        throw new Error(result.message);
      };

      return result.data;
    },
  });

  return (
    <section className="home">
      <title>Home</title>
      <main className="main_store">
        <div
          className="carrossel"
          id="promotions"
          aria-label="Carrossel de promoções"
        >
          <BannerCarrossel
            banners={promotions ?? []}
            className="banner_promotions"
          />
        </div>
        {isPending ? (
          <SkeletonSlider slidesNumber={slidesToShow}/>
        ) : isError ? (
          <div><p className="alert">{error instanceof Error ? error.message : "Não foi possível carregar os produtos"}</p></div>
        ) : homeProducts.flash.length > 0 ? (
          <CarrosselOffers
            titleHidden={false}
            icon={<BsFillLightningChargeFill />}
            className="flash"
            title="Ofertas Relâmpago"
            products={homeProducts.flash}
            ariaLabel="Ofertas Relâmpago, compre antes de acabar o estoque"
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToShow}
            autoplay={false}
            autoplaySpeed={0}
            pauseOnHover={false}
            cardPreviewMode={CardMode.PORTRAIT}
            button={true}
          />
        ) : null}
        
        <BannerCarrossel banners={offersPromo} className="banner_offers" />
        
        {isPending ? (
          <SkeletonSlider slidesNumber={slidesToShow}/>
        ) : isError ? (
          <div><p className="alert">{error instanceof Error ? error.message : "Não foi possível carregar os produtos"}</p></div>
        ) : homeProducts.flash.length > 0 ? (
          <CarrosselOffers
            titleHidden={false}
            icon={<LiaSearchDollarSolid />}
            className="most-wanted"
            title="Mais Procurados"
            products={homeProducts.mostWanted}
            ariaLabel="Os Produtos mais procurados"
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToShow}
            autoplay={false}
            autoplaySpeed={0}
            pauseOnHover={false}
            cardPreviewMode={CardMode.PORTRAIT}
            button={true}
          />
        ) : null}
        
        {isPending ? (
          <SkeletonSlider slidesNumber={slidesToShow}/>
        ) : isError ? (
          <div><p className="alert">{error instanceof Error ? error.message : "Não foi possível carregar os produtos"}</p></div>
        ) : homeProducts.flash.length > 0 ? (
          <CarrosselOffers
            titleHidden={false}
            icon={<TbCrown />}
            className="recommendations"
            title="Recomendações"
            products={homeProducts.recommendations}
            ariaLabel="Produtos recomendados para você"
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToShow}
            autoplay={false}
            autoplaySpeed={0}
            pauseOnHover={false}
            cardPreviewMode={CardMode.PORTRAIT}
            button={true}
          />
        ) : null}
      </main>
    </section>
  );
};

export default Home;