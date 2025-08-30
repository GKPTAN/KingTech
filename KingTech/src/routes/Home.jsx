import { useState } from 'react';
import { TbTopologyStar3, TbCrown } from 'react-icons/tb';
import { LiaSearchDollarSolid } from 'react-icons/lia';
import BannerCarrossel from '../components/layout/banners/BannerCarrossel';
import CarrosselOffers from '../components/layout/CarrosselOffers';
import '../style/Home.css';

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

  return (
    <section className="home">
      <title>Home</title>
      <main className="main-store">
        <div className="carrossel" id='promotions' aria-label="Carrossel de promoções">
          <BannerCarrossel 
            banners={promotions}
            className="banner-promotions"
          />
        </div>
        <CarrosselOffers
          icon={<TbTopologyStar3 />}
          className="highlights"
          title="Destaques"
          ariaLabel="Produtos em destaque"
        />
        <BannerCarrossel 
          banners={offersPromo}
          className="banner-offers"
        />
        <CarrosselOffers 
          icon={<LiaSearchDollarSolid />}
          className="most-wanted"
          title="Mais Procurados"
          ariaLabel="Produtos mais procurados"
        />
        <CarrosselOffers 
          icon={<TbCrown />}
          className="recommendations"
          title="Recomendações"
          ariaLabel="Produtos recomendados para você"
        />
      </main>
    </section>
  );
};

export default Home