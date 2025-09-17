import { Link } from "react-router-dom";
import { MdLocalOffer, MdDeleteSweep } from "react-icons/md";
import { TbCrown } from "react-icons/tb";
import { useForm } from "../hooks/useStep";
import BasketTech from "../components/layout/pages/Cart/BasketTech";
import Button from "../components/layout/Button";
import Steps from "../components/layout/pages/Cart/Steps";
import CarrosselOffers from "../components/layout/CarrosselOffers";
import "../style/Cart.css";
import "../style/responsive/routes/Cart/Cart.responsive.css";

const stepTitles = [
  "Cesta",
  "Endereço",
  "Entrega",
  "Identificação",
  "Pagamento",
  "Confirmação",
];

const products = [
  
];

const Cart = () => {

  const handleRemove = () => {

  };
  
  const formComponents = [
    <BasketTech handleRemove={handleRemove} products={products} />
  ];

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } = useForm(formComponents);

  const title = stepTitles[currentStep];

  return (
    <div className="cart">
      <title>Cesta</title>
      {(!products || products.length === 0) && (
        <div className="aviso">
          <h2>Sua cesta está vazia</h2>
          <p>
            Ainda está pensando? Adicione mais produtos e veja nossas ofertas
            exclusivas.
          </p>
          <Link className="btn-aviso" to="/">
            Ver Produtos <MdLocalOffer size={20} />
          </Link>
        </div>
      )}
      {products.length > 0 && (
        <>
          <Steps currentStep={currentStep} />
          <h1>{title}</h1>
          <form className="steps-cart" onSubmit={(e) => changeStep(currentStep + 1, e)}>
            <div className="intro-form">
              <p>
                Vendido e entregue por <strong>KingTech</strong>
              </p>
              <Button
                type="button"
                nameAction="Remover todos os produtos"
                className="btn-remove-all-products"
                disabled={false}
                onClick={() => handleRemove}
                icon={<MdDeleteSweep size={30}/>}
              />
            </div>
            <div className="main-steps">
              {currentComponent}
            </div>
            {currentStep > 0 && (
              <Button 
                type="button"
                nameAction="Voltar"
                className="btn-back"
                disabled={false}
                onClick={() => changeStep(currentStep - 1)}
              />
            )}
            <Button 
              type="submit"
              nameAction="Continuar"
              className="btn-keep"
              disabled={false}
              onClick={() => {}}
            />
          </form>
          <CarrosselOffers
            titleHidden={false}
            className="recommend"
            ariaLabel="recomendações para você"
            title="Recomendações"
            icon={<TbCrown />}
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={2}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2500}
            pauseOnHover={true}
            cardPreviewMode="landscape"
            button={true}
            cart={true}
          />
        </>
      )}
    </div>
  );
};

export default Cart;
