import { TbTruckDelivery, TbLockCheck } from "react-icons/tb";
import { BsFillLightningChargeFill, BsCreditCard } from "react-icons/bs";

const StoreAdvantages = () => {
  const advantages = [
    {title: "Frete grátis", text: "Em produtos e regiões selecionadas, aproveite condições especiais.", icon: <TbTruckDelivery size={40} color="#037c76ff" />},
    {title: "Compra 100% segura", text: "Ambiente protegido com criptografia e diversas formas de pagamento confiáveis.", icon: <TbLockCheck size={40} color="#037c76ff"/>},
    {title: "Entrega rápida e segura", text: "receba seus produtos no conforto da sua casa com agilidade e rastreamento em tempo real.", icon: <BsFillLightningChargeFill size={40} fill="#037c76ff"/>},
    {title: "Parcele sem juros", text: "até 10x no cartão de crédito, sem taxas adicionais.", icon: <BsCreditCard size={40} fill="#037c76ff"/>},
  ]
  return (
    <div className="advantages-store">
      <h2>Por que comprar na KingTech?</h2>
      <ul>
        {advantages.map((adv, idx) => (
          <li key={idx} className="item">
            {adv.icon}
            <div>
              <h3>{adv.title}</h3>
              <p>{adv.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreAdvantages