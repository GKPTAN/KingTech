import { useWidthWindow } from "../../../../hooks/useWindowWidth";
import { useState, useEffect } from "react";
import { RiShoppingBasketFill } from "react-icons/ri";
import { TiLocation } from "react-icons/ti";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMiniIdentification } from "react-icons/hi2";
import { BiMoney } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";

const Steps = ({ currentStep }) => {
  let widthWindow = useWidthWindow();
  const [sizeIcon, setSizeIcon] = useState();

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
      <div className={`step ${currentStep === 0 ? "active" : ""}`}>
        <RiShoppingBasketFill size={sizeIcon} />
        <p>Cesta</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === 1 ? "active" : ""}`}>
        <TiLocation size={sizeIcon} />
        <p>Endereço</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === 2 ? "active" : ""}`}>
        <TbTruckDelivery size={sizeIcon} />
        <p>Entrega</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === 3 ? "active" : ""}`}>
        <HiMiniIdentification size={sizeIcon} />
        <p>Identificação</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === 4 ? "active" : ""}`}>
        <BiMoney size={sizeIcon} />
        <p>Pagamento</p>
      </div>
      <div className="divisor"></div>
      <div className={`step ${currentStep === 5 ? "active" : ""}`}>
        <GiConfirmed size={sizeIcon} />
        <p>Confirmação</p>
      </div>
    </div>
  );
};

export default Steps;
