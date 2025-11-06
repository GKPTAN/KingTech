import { useWidthWindow } from '../hooks/useWindowWidth';
import { useState } from 'react';
import { TbTopologyStar3, TbCrown } from 'react-icons/tb';
import { LiaSearchDollarSolid } from 'react-icons/lia';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import BannerCarrossel from '../components/layout/banners/BannerCarrossel';
import CarrosselOffers from '../components/layout/CarrosselOffers';
import '../style/Home.css';
import '../style/responsive/routes/Home/Home.responsive.css';

const promotionsStore = [
    {id: 1, title: 'Promoção 1', description: "Desconto de 20% em todos os produtos", src: "/image/banner1.webp"},
    {id: 2, title: 'Promoção 2', description: "Desconto de 50% em todos os produtos", src: "/image/banner2.jpg"},
    {id: 3, title: 'Promoção 3', description: "Desconto de 70% em todos os produtos", src: "/image/banner3.jpg"},
];

const promotionOffers = [
  {id: 1, title: 'Samsung Galaxy S21', description: "Smartphone com câmera de 108MP", price: 2999.99, src: "/image/banner1.webp"},
  {id: 2, title: 'Iphone 13', description: "Smartphone com câmera de 140MP", price: 3999.99, src: "/image/banner2.jpg"},
  {id: 3, title: 'PS5', description: "Console de jogos", price: 2599.99, src: "/image/banner3.jpg"},
];

const Home = () => {
  const [promotions, setPromotions] = useState(promotionsStore);
  const [offersPromo, setOffersPromo] = useState(promotionOffers);
  let widthWindow = useWidthWindow();

  return (
    <section className="home">
      <title>Home</title>
      <main className="main_store">
        <div className="carrossel" id="promotions" aria-label="Carrossel de promoções">
          <BannerCarrossel 
            banners={promotions}
            className="banner_promotions"
          />
        </div>
        <CarrosselOffers
          titleHidden={false}
          icon={<BsFillLightningChargeFill />}
          className="flash"
          title="Ofertas Relâmpago"
          ariaLabel="Ofertas Relâmpago, compre antes de acabar o estoque"
          dots={false}
          infinite={false}
          speed={500}
          slidesToShow={widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5 }
          slidesToScroll={widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5}
          autoplay={false}
          autoplaySpeed={0}
          pauseOnHover={false}
          cardPreviewMode={"portrait"}
          button={true}
        />
        <BannerCarrossel 
          banners={offersPromo}
          className="banner_offers"
        />
        <CarrosselOffers 
          titleHidden={false}
          icon={<LiaSearchDollarSolid />}
          className="most-wanted"
          title="Mais Procurados"
          ariaLabel="Os Produtos mais procurados"
          dots={false}
          infinite={false}
          speed={500}
          slidesToShow={widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5}
          slidesToScroll={widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5}
          autoplay={false}
          autoplaySpeed={0}
          pauseOnHover={false}
          cardPreviewMode='portrait'
          button={true}
        />
        <CarrosselOffers 
          titleHidden={false}
          icon={<TbCrown />}
          className="recommendations"
          title="Recomendações"
          ariaLabel="Produtos recomendados para você"
          dots={false}
          infinite={false}
          speed={500}
          slidesToShow={widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5}
          slidesToScroll={widthWindow <= 650 ? 2 : widthWindow <= 1024 ? 3 : 5}
          autoplay={false}
          autoplaySpeed={0}
          pauseOnHover={false}
          cardPreviewMode='portrait'
          button={true}
        />
      </main>
    </section>
  );
};

export default Home