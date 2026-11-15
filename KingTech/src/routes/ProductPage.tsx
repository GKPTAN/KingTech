import { useState } from "react";
import { PiShareNetwork } from "react-icons/pi";
import { RiFlashlightFill, RiShoppingBasketFill } from "react-icons/ri";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { TbTruckDelivery } from "react-icons/tb";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

import { useWidthWindow } from "@/hooks/useWindowWidth";

import { formatarMoeda } from "@/utils/formatCurrency";

import { CardMode } from "@/types/products";

import PromoConditionsModal from "@/components/layout/pages/ProductPage/Modals/PromoConditionsModal";
import ImageSlideModal from "@/components/layout/pages/ProductPage/Sliders/ImageSlideModal";
import Button from "@/components/layout/Button";
import HeartFavorite from "@/components/layout/HeartFavorite";
import ProductVariants from "@/components/layout/pages/ProductPage/Product/ProductVariants";
import StoreAdvantages from "@/components/layout/pages/ProductPage/StoreAdvantages";
import CarrosselOffers from "@/components/layout/CarrosselOffers";
import QuestionsAndAnswers from "@/components/layout/pages/ProductPage/Questions/QuestionsAndAnswers";
import PaymentMethods from "@/components/layout/pages/ProductPage/Payment/PaymentMethods";
import Reviews from "@/components/layout/pages/ProductPage/Reviews/Reviews";

import { brandIcons } from "@/data/brandIcons";
import { product } from "@/data/departmentsData";
import "@/style/ProductPage.css";
import "@/style/responsive/routes/ProductPage/ProductPage.responsive.css";

const questions = [
  {
    id: 1,
    text: "Esse produto é compatível com placa mãe B550?",
    answers: [
      { id: 1, author: "Loja KingTech", date: "20/01/2025", text: "Sim, é compatível.", likesCount: 7, dislikesCount: 3},
      { id: 2, author: "Carlos", date: "21/01/2025", text: "Uso aqui e funciona de boa.", likesCount: 43, dislikesCount: 12 }
    ]
  },
  {
    id: 2,
    text: "Qual é a voltagem?",
    answers: [
      { id: 1, author: "Ana", date: "19/01/2025", text: "É bivolt automático.", likesCount: 55, dislikesCount: 6 }
    ]
  }
];

const ProductPage = () => {
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  let widthWindow = useWidthWindow();
  const [image, setImage] = useState(0);

  const stockClass = product.quantity > 0 ? "in" : "out";

  return (
    <div className="product-page">
      <section className='mini-banner'>
        <img src="/image/banner1.webp" alt="banner promocional" />
        <Button 
          type="button"
          nameAction="Ver condições"
          className="btn-promo"
          disabled={false}
          onClick={() => setShowPromoModal(true)}
          icon=""
        />
      </section>

      <section className="product-card-main">
        {showPromoModal && (
          <PromoConditionsModal onClose={() => setShowPromoModal(false)} />
        )}

        {showImageModal && (
          <ImageSlideModal
            images={product.img ?? []}
            onClose={() => setShowImageModal(false)}
            price={product.price_pix ?? ""}
            alt={product.name ?? ""}
          />
        )}

        <div className="image-product">
          <div className="vertical-images">
            {product?.img && product.img.slice(0, 4).map((src, idx) => (
              <img
                key={idx}
                className={image === idx ? "active" : ""}
                src={src}
                alt={`Produto imagem ${idx + 1}`}
                onClick={() => setImage(idx)}
              />
            ))}
            <div
              className="more-images"
              onClick={() => setShowImageModal(true)}
            >
              +{product.img.length - 4}
            </div>
          </div>
          <div className="info-image">
            <div className="main-image">
              <img src={product.img[image] ?? ""} alt={product.name ?? ""} />
            </div>
            <ProductVariants variants={product.variations ?? []} />
          </div>
        </div>

        <div className="quick-options">
          <Button
            type="button"
            nameAction=""
            className="share-btn"
            onClick={() => {}}
            icon={<PiShareNetwork size={widthWindow > 600 ? 30 : 20} />}
            disabled={false}
          />
          <HeartFavorite />
        </div>

        <div className="product-info">
          <div className="brand-logo">{brandIcons[product.brand] ?? ""}</div>
          <div className="rating-box">
            <Rating
              name="product-rating"
              value={product.rating ?? 0}
              readOnly={true}
            />
            <span className="rating-value">{product.rating ?? ""}</span>
            <span className="rating-count">({product.number_rating ?? ""})</span>
            <a href="#reviews" className="see-all-reviews">
              Ver todas as avaliações
            </a>
          </div>
          <h1 className="product-name">{product.name ?? ""}</h1>
          <span className="product-code">Cód: {product.code ?? ""}</span>
          {product?.main_informations && product.main_informations.length > 0 && (
            <ul className="main-infos">
              {product.main_informations.map((info) => (
                <li key={info.id}>
                  <strong>{info.title}:</strong> {info.information}
                </li>
              ))}
            </ul>
          )}
          <div className="delivery-type">
            <span>
              <RiFlashlightFill size={20} fill="#f9cb40" />
              <TbTruckDelivery size={30} color="#fff" />
            </span>
            {product?.typeDelivery?.toUpperCase()}
          </div>
          <div className="sold-by">
            Vendido e entregue por <strong>KingTech</strong>
          </div>
          <div className="warranty">12 meses de garantia</div>
          <div className="prices">
            <span className="prev-price">
              De: {(product?.prev_price && formatarMoeda(product.prev_price)) ?? ""}
            </span>
            <span className="price-card">
              <p>
                No cartão da loja: {(product?.price_in_card_store && formatarMoeda(product.price_in_card_store)) ?? ""}
                <span className="discount">-{product.descount ?? ""}</span>
              </p>
            </span>
            <span className="price-card-part">
              ou 10x de {" "}
              {(product?.price_part_in_card_store && formatarMoeda(product.price_part_in_card_store / 10)) ?? ""}
            </span>
            <span className="price-pix">
              No Pix: {" "}
              {(product?.price_pix && formatarMoeda(product.price_pix)) ?? ""}{" "}
              <span className="discount-pix">-{product.discount_pix ?? ""}</span>
            </span>
            <a href="#payment-methods" className="see-more-payments">
              Ver mais opções de pagamento
            </a>
          </div>

          <div className={`stock ${stockClass}`}>
            {product.quantity > 0 ? "" : "Esgotado"}
          </div>

          <div className="shipping-calc">
            <label htmlFor="cep">Consultar frete</label>
            <input
              type="text"
              name="cep_user"
              id="cep"
              placeholder="Digite seu CEP"
            />
            <Button
              type="button"
              nameAction="Calcular"
              className=""
              disabled={false}
              onClick={() => {}}
              icon=""
            />
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="forgot-cep"
            >
              Não lembro meu CEP
            </a>
          </div>
          <Button
            type="button"
            nameAction="Adicionar à cesta"
            className="add-to-cart"
            disabled={false}
            onClick={() => {}}
            icon={<RiShoppingBasketFill size={30} />}
          />

          <Link to="#" className="exchange-policy">
            Politica de troca e devolução
          </Link>
        </div>
      </section>

      <section className="store-advantages">
        <StoreAdvantages />
      </section>

      <CarrosselOffers
        titleHidden={false}
        className="related"
        ariaLabel="Produtos relacionados"
        title="Produtos Relacionados"
        icon=""
        dots={false}
        infinite={false}
        speed={500}
        slidesToShow={widthWindow > 768 ? 4 : widthWindow <= 768 && widthWindow > 600 ? 3 : 2}
        slidesToScroll={widthWindow > 768 ? 4 : widthWindow <= 768 && widthWindow > 600 ? 3 : 2}
        autoplay={false}
        autoplaySpeed={2500}
        pauseOnHover={false}
        cardPreviewMode={CardMode.PORTRAIT}
        button={false}
        cart={false}
      />

      <section className="product-sheet">
        <h2>Ficha Técnica</h2>
        <table>
          {product?.specs && (
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </section>

      <section className="banner">
        <img src="/image/banner2.jpg" alt="Banner promocional" />
      </section>

      <CarrosselOffers
        titleHidden={false}
        className="most-wanted"
        ariaLabel="Produtos mais procurados"
        title="Mais procurados"
        icon={<LiaSearchDollarSolid />}
        dots={false}
        infinite={true}
        speed={500}
        slidesToShow={widthWindow > 768 ? 4 : widthWindow <= 768 && widthWindow > 600 ? 3 : 2}
        slidesToScroll={widthWindow > 768 ? 4 : widthWindow <= 768 && widthWindow > 600 ? 3 : 2}
        autoplay={false}
        autoplaySpeed={2500}
        pauseOnHover={false}
        cardPreviewMode={CardMode.PORTRAIT}
        button={true}
        cart={false}
      />

      <Reviews
        product={product}
      />

      <QuestionsAndAnswers maxQuestions={50} questions={questions} />

      <PaymentMethods 
        prevPrice={product.prev_price ?? null} 
        pricePix={product.price_pix ?? null} 
        priceInCardStore={product.price_in_card_store ?? null} 
        pricePartInCardStore={product.price_part_in_card_store ?? 0}
      />
    </div>
  );
};

export default ProductPage;
