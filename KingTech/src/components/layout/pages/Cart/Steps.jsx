import { RiShoppingBasketFill } from "react-icons/ri";
import { TiLocation } from 'react-icons/ti';
import { TbTruckDelivery } from "react-icons/tb";
import { HiMiniIdentification } from "react-icons/hi2";
import { BiMoney } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi"

const Steps = ({currentStep}) => {
  return (
    <div className="steps">
        <div className={`step ${currentStep === 0 ? 'active' : ''}`}>
            <RiShoppingBasketFill size={40}/>
            <p>Cesta</p>
        </div>
        <div className="divisor"></div>
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
            <TiLocation size={40}/>
            <p>Endereço</p>
        </div>
        <div className="divisor"></div>
        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
            <TbTruckDelivery size={40}/>
            <p>Entrega</p>
        </div>
        <div className="divisor"></div>
        <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
            <HiMiniIdentification size={40}/>
            <p>Identificação</p>
        </div>
        <div className="divisor"></div>
        <div className={`step ${currentStep === 4 ? 'active' : ''}`}>
            <BiMoney size={40}/>
            <p>Pagamento</p>
        </div>
        <div className="divisor"></div>
        <div className={`step ${currentStep === 5 ? 'active' : ''}`}>
            <GiConfirmed size={40}/>
            <p>Confirmação</p>
        </div>
    </div>
  );
};

export default Steps