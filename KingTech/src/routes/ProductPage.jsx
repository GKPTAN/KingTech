import { useState } from "react";
import { SiAmd } from "react-icons/si";
import { PiShareNetwork } from "react-icons/pi";
import { RiShoppingBasketFill, RiFlashlightFill } from "react-icons/ri";
import { LiaSearchDollarSolid } from "react-icons/lia";
import { TbTruckDelivery } from "react-icons/tb";
import { MdLocalOffer } from "react-icons/md";
import { Link } from "react-router-dom";
import { product } from "../data/departmentsData.js";
import { brandIcons } from "../data/brandIcons.jsx";
import PromoConditionsModal from "../components/layout/pages/ProductPage/Modals/PromoConditionsModal";
import ImageSlideModal from "../components/layout/pages/ProductPage/Sliders/ImageSlideModal";
import Button from "../components/layout/Button";
import HeartFavorite from "../components/layout/HeartFavorite";
import Rating from "@mui/material/Rating";
import ProductVariants from "../components/layout/pages/ProductPage/Product/ProductVariants";
import StoreAdvantages from "../components/layout/pages/ProductPage/StoreAdvantages";
import CarrosselOffers from "../components/layout/CarrosselOffers";
import QuestionsAndAnswers from "../components/layout/pages/ProductPage/Questions/QuestionsAndAnswers";
import PaymentMethods from "../components/layout/pages/ProductPage/Payment/PaymentMethods";
import "../style/ProductPage.css";
import Reviews from "../components/layout/pages/ProductPage/Reviews/Reviews";

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
  const [image, setImage] = useState(0);

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
            images={product.img}
            onClose={() => setShowImageModal(false)}
            price={product.pricePix}
            alt={product.name}
          />
        )}

        <div className="image-product">
          <div className="vertical-images">
            {product.img.slice(0, 4).map((src, idx) => (
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
          <div className="main-image">
            <img src={product.img[image]} alt={product.name} />
          </div>
          <ProductVariants variants={product.variations} />
        </div>

        <div className="quick-options">
          <Button
            type="button"
            nameAction=""
            className="share-btn"
            onClick={() => {}}
            icon={<PiShareNetwork size={30} />}
          />
          <HeartFavorite />
        </div>

        <div className="product-info">
          <div className="brand-logo">{brandIcons[product.brand]}</div>
          <div className="rating-box">
            <Rating
              name="product-rating"
              value={product.rating}
              readOnly={true}
            />
            <span className="rating-value">{product.rating}</span>
            <span className="rating-count">({product.numberRating})</span>
            <a href="#reviews" className="see-all-reviews">
              Ver todas as avaliações
            </a>
          </div>
          <h1 className="product-name">{product.name}</h1>
          <span className="product-code">Cód: {product.code}</span>
          <ul className="main-infos">
            {product.mainInformations.map((info) => (
              <li key={info.id}>
                <strong>{info.title}:</strong> {info.information}
              </li>
            ))}
          </ul>
          <div className="delivery-type">
            <span>
              <RiFlashlightFill size={20} fill="#f9cb40" />
              <TbTruckDelivery size={30} color="#fff" />
            </span>
            {product.typeDelivery.toUpperCase()}
          </div>
          <div className="sold-by">
            Vendido e entregue por <strong>KingTech</strong>
          </div>
          <div className="warranty">12 meses de garantia</div>
          <div className="prices">
            <span className="prev-price">
              De: R${" "}
              {product.prevPrice.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="price-card">
              No cartão da loja: R${" "}
              {product.priceInCardStore.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}{" "}
              <span className="discount">-{product.descount}</span>
            </span>
            <span className="price-card-part">
              ou 10x de R${" "}
              {(product.pricePartInCardStore / 10).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="price-pix">
              No Pix: R${" "}
              {product.pricePix.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}{" "}
              <span className="discount-pix">-{product.discountPix}</span>
            </span>
            <a href="#payment-methods" className="see-more-payments">
              Ver mais opções de pagamento
            </a>
          </div>

          <div className={`stock ${product.stock ? "in-stock" : "out-stock"}`}>
            {product.stock ? "Em estoque" : "Esgotado"}
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
        slidesToShow={4}
        slidesToScroll={4}
        autoplay={false}
        autoplaySpeed={2500}
        pauseOnHover={false}
        cardPreviewMode="portrait"
        button={false}
        cart={false}
      />

      {product.code === "599420" && (
        <section className="product-details">
          <article className={product.texts[0].category}>
            <div>
              <h2>{product.texts[0].title}</h2>
              <p>{product.texts[0].text}</p>
            </div>
            <div>
              <img
                src={product.texts[0].imgSm}
                alt="pc gamer - imagem imeramente ilustrativa"
              />
            </div>
          </article>
          <article className={product.texts[1].category}>
            <div>
              <h2>{product.texts[1].title}</h2>
              <p>{product.texts[1].text}</p>
            </div>
            <div>
              <img
                src={product.texts[1].imgSm}
                alt="chip - imagem meramente ilustrativa"
              />
            </div>
          </article>
          <article className={product.texts[2].category}>
            <div>
              <h2>{product.texts[2].title}</h2>
              <p>{product.texts[2].text}</p>
              <h2>{product.texts[3].title}</h2>
              <p>{product.texts[3].text}</p>
            </div>
            <div>
              <img
                src={product.texts[3].imgSm}
                alt="Desempenho das placas de videos AMD Radeon RX Série 9000"
              />
            </div>
            <div>
              <h2>{product.texts[4].title}</h2>
            </div>
            <div>
              <img
                src={product.texts[4].imgSm}
                alt="Desempenho da placa de video AMD Radeon RX 9060 XT onde possui 157 FPS no Fórmula 1, 104 FPS no God Of War Ragnarok, 92 FPS no Horizon Zero Dawn Remastered, 77 FPS no Call of Duty: Black Ops 6, 72 FPS no Dragon Age: The Veilguard, 98 FPS no Assassins Creed Mirage, 79 FPS no Resident Evil 4 e 136 FPS no Doom Eternal"
              />
            </div>
          </article>
          <article className={product.texts[5].category}>
            <div>
              <h2>{product.texts[5].title}</h2>
              <p>{product.texts[5].text}</p>
            </div>
            <div className="realismo-perfomance">
              <div className="statistic">
                <h3>F1 24</h3>
                <div className="formula1">
                  <p>65 FPS</p>
                </div>
                <h3>Indiana Jones and the Great Circle</h3>
                <div className="indiana">
                  <p>64 FPS</p>
                </div>
                <h3>Shadow of the Tomb Raider</h3>
                <div className="shadow">
                  <p>88 FPS</p>
                </div>
                <h3>Far Cry 6</h3>
                <div className="far">
                  <p>111 FPS</p>
                </div>
                <h3>Forza Horizon 5</h3>
                <div className="forza">
                  <p>114 FPS</p>
                </div>
              </div>
            </div>
          </article>
          <article className={product.texts[6].category}>
            <div>
              <h2>{product.texts[6].title}</h2>
              <p>{product.texts[6].text}</p>
            </div>
          </article>
          <article className={product.texts[7].category}>
            <div>
              <h2>{product.texts[7].title}</h2>
              <p>{product.texts[7].text}</p>
            </div>
            <div className="video-img">
              <img
                src={product.texts[7].imgSm}
                alt="streamer jogando no pc - imagem meramente ilustrativa"
              />
            </div>
          </article>
          {/* Carrossel personalizado */}
          {/* <div className='category-buttons'>
          <Button />
          <Button />
        </div> */}
        </section>
      )}

      <section className="product-sheet">
        <h2>Ficha Técnica</h2>
        <table>
          <tbody>
            {Object.entries(product.specs).map(([key, value]) => (
              <tr key={key}>
                <th>{key}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
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
        slidesToShow={4}
        slidesToScroll={4}
        autoplay={false}
        autoplaySpeed={2500}
        pauseOnHover={false}
        cardPreviewMode="portrait"
        button={true}
        cart={false}
      />

      <Reviews
        product={product}
      />

      <QuestionsAndAnswers maxQuestions={50} questions={questions} />

      <PaymentMethods prevPrice={product.prevPrice} pricePix={product.pricePix} priceInCardStore={product.priceInCardStore} pricePartInCardStore={product.pricePartInCardStore}/>
    </div>
  );
};

export default ProductPage;
