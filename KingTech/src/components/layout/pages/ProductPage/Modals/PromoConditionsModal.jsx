import { BiSolidOffer } from "react-icons/bi";
import { GiPartyPopper } from "react-icons/gi";
import { PiSealWarningFill } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import Button from "../../../Button";

const PromoConditionsModal = ({onClose}) => {
  return (
    <div className='promo-conditions'>
      <h2><BiSolidOffer fill="#f9cb40" size={30}/> Condições da Promoção</h2>
      <h3><GiPartyPopper size={30} /> Promoção Black Friday – Ofertas Exclusivas <GiPartyPopper size={30}/></h3>
      <p>Aproveite a maior Black Friday da KingTech com descontos imperdíveis:</p>
      <ul className="list-advantages">
        <li>Produtos com até 80% OFF em diversas categorias.</li>
        <li>Cupom de desconto adicional de 20% OFF em produtos selecionados.</li>
        <li>Cashback especial em compras participantes.</li>
        <li>Frete grátis para todo o Brasil em pedidos realizados durante o período da promoção.</li>
      </ul>
      <h4><PiSealWarningFill size={20}/> Condições importantes: </h4>
      <ul className="list-conditions">
        <li>O desconto de até 80% já está aplicado diretamente nos produtos.</li>
        <li>O cupom de 20% OFF é válido apenas em produtos selecionados e não é cumulativo com outras promoções.</li>
        <li>Cashback válido apenas para compras dentro do período promocional e conforme regras do programa.</li>
        <li>Promoção por tempo limitado ou enquanto durarem os estoques.</li>
      </ul>
      <p>Não perca! Garanta já seus produtos favoritos com os melhores preços do ano!</p>
      <Link to={"/"}>Ver as demais promoções</Link>
      <Button 
        type="button"
        nameAction=""
        className="close-btn"
        disabled={false}
        onClick={onClose}
        icon={<AiOutlineClose />}
      />
    </div>
  );
};

export default PromoConditionsModal