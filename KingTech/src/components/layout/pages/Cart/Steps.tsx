import { useEffect, useState } from "react";
import { RiShoppingBasketFill } from "react-icons/ri";
import { TiLocation } from "react-icons/ti";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMiniIdentification } from "react-icons/hi2";
import { BiMoney } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";

import { useWidthWindow } from "@/hooks/useWindowWidth.tsx";

import { CartSteps } from "@/types/steps.ts";


interface StepsProps {
  currentStep: number;
}

const Steps = ({ currentStep }: StepsProps) => {
  let widthWindow = useWidthWindow();
  const [sizeIcon, setSizeIcon] = useState<number>(0);

  useEffect(() => {
    if (widthWindow > 800) {
      setSizeIcon(40);
    } else if (widthWindow <= 800 && widthWindow > 700) {
      setSizeIcon(30);
    } else if (widthWindow <= 700 && widthWindow > 400) {
      setSizeIcon(20);
    } else {
      setSizeIcon(15);
    }
  }, [widthWindow]);

  return (
    <div className="steps">
      <div className={`step ${currentStep === CartSteps.BASKET ? "active" : ""}`}>
        <RiShoppingBasketFill size={sizeIcon} />
        <p>Cesta</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === CartSteps.ADDRESS ? "active" : ""}`}>
        <TiLocation size={sizeIcon} />
        <p>Endereço</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === CartSteps.DELIVERY ? "active" : ""}`}>
        <TbTruckDelivery size={sizeIcon} />
        <p>Entrega</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === CartSteps.IDENTIFICATION ? "active" : ""}`}>
        <HiMiniIdentification size={sizeIcon} />
        <p>Identificação</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === CartSteps.PAYMENT ? "active" : ""}`}>
        <BiMoney size={sizeIcon} />
        <p>Pagamento</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === CartSteps.CONFIRMATION ? "active" : ""}`}>
        <GiConfirmed size={sizeIcon} />
        <p>Confirmação</p>
      </div>
    </div>
  );
};

export default Steps;
