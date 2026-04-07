/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdDeleteSweep, MdLocalOffer } from "react-icons/md";
import { TbCrown } from "react-icons/tb";

import { useWidthWindow } from "@/hooks/useWindowWidth.tsx";
import { useForm } from "@/hooks/useStep.tsx";

import { CartSteps } from "@/types/steps.ts";
import { CardMode } from "@/types/products.ts";

import BasketTech from "@/components/layout/pages/Cart/BasketTech.tsx";
import Button from "@/components/layout/Button.tsx";
import Steps from "@/components/layout/pages/Cart/Steps.tsx";
import CarrosselOffers from "@/components/layout/CarrosselOffers.tsx";
import AddressBuy, { type AddressData } from "@/components/layout/pages/Cart/Address/AddressBuy.tsx";
import DeliveryBuy from "@/components/layout/pages/Cart/Delivery/DeliveryBuy.tsx";

import "@/style/Cart.css";
import "@/style/responsive/routes/Cart/Cart.responsive.css";

const stepTitles: Record<CartSteps, string> = {
  [CartSteps.BASKET]: "Cesta",
  [CartSteps.ADDRESS]: "Endereço",
  [CartSteps.DELIVERY]: "Entrega",
  [CartSteps.IDENTIFICATION]: "Identificação",
  [CartSteps.PAYMENT]: "Pagamento",
  [CartSteps.CONFIRMATION]: "Confirmação",
};

const products = [
  {
    id: 0,
    name: "Adaptador Conversor Hdmi Para Vga 25 Cm",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: 1200.00,
    price: 999.99,
    pricePix: 949.99,
    priceCard: 979.99,
    alt: "imagem do produto",
    brand: "KingTech",
    code: "KT-ADP-HDVGA-001",
    tags: ["Adaptador", "Conversor", "Hdmi", "Vga"],
  },
  {
    id: 1,
    name: "B-Clarin For Tattoo Cicatriza Proteção Para Tatuagens 30Ml",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: 1200.00,
    price: 999.99,
    pricePix: 949.99,
    priceCard: 979.99,
    alt: "imagem do produto",
    brand: "KingTech",
    code: "KT-BCF-TAT-002",
    tags: ["B-Clarin", "Tatuagem", "Cicatrizante"],
  },
];

const Cart = () => {
  const handleRemove = () => {};
  let widthWindow = useWidthWindow();
  const [addressData, setAddressData] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    state: "",
    city: "",
    reference: "",
    nickname: ""
  });

  const updateDataAddress = (fields: Partial<AddressData>) => {
    setAddressData((prev) => ({ ...prev, ...fields }));
  };

  const formComponents = [
    <BasketTech handleRemove={handleRemove} products={products} />,
    <AddressBuy data={addressData} updateFields={updateDataAddress}/>,
    <DeliveryBuy />,
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useForm(formComponents);

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
          <form
            className="steps-cart"
            onSubmit={(e) => changeStep(currentStep + 1, e)}
          >
            {currentStep === CartSteps.BASKET && (
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
                icon={<MdDeleteSweep size={30} />}
              />
            </div>
            )}
            <div className="main-steps">{currentComponent}</div>
            <div className="options-steps">
              {currentStep > CartSteps.BASKET && (
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
              />
            </div>
          </form>
          {currentStep === CartSteps.BASKET && (
            <CarrosselOffers
            titleHidden={false}
            className="recommend"
            ariaLabel="recomendações para você"
            title="Recomendações"
            icon={<TbCrown />}
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={widthWindow > 800 ? 2 : 1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={2500}
            pauseOnHover={true}
            cardPreviewMode={CardMode.LANDSCAPE}
            button={true}
            cart={true}
          />
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
