import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../Button"

const SummaryCart = ({products}) => {
  const priceTotalProducts = products.map(p => p.price).reduce((a, b) => a + b, 0);
  console.log("Preço total: ", priceTotalProducts)
  const [valorFrete, setValorFrete] = useState(priceTotalProducts);

  const calcularFrete = (price) => {
    setValorFrete(price + 25);
  };

  return (
    <div className="summary-cart">
      <p><strong>Produtos: </strong>{products.length}</p>
      <p className="subtotal">Subtotal: <span style={{opacity: "0.7"}}>{products.map(p => p.prevPrice).reduce((a, b) => a + b, 0)}</span></p>
      <div className="cep">
        <label htmlFor="cep_dest">Frete</label>
        <input type="text" name="cep" id="cep_dest" placeholder="insira seu cep" minLength={8} maxLength={8} />
        <Button 
          type="button"
          className="btn-cep"
          nameAction="Calcular frete"
          disabled={false}
          onClick={() => calcularFrete(priceTotalProducts)}
        />
        <span id="res">Valor com frete: {valorFrete}</span>
      </div>
      <div className="info-price">
        <p className="value-pix">Á vista no pix em R$ {(priceTotalProducts * 0.70).toLocaleString("pt-BR", {maximumFractionDigits: 2})}, economize <span style={{color: "#047973", fontWeight: "bold"}}>R$ {(priceTotalProducts - (priceTotalProducts * 0.70)).toLocaleString("pt-BR", {maximumFractionDigits: 2})} reais</span></p>
        <p className="value-card">Á vista no cartão da loja em R$ {(priceTotalProducts * 0.85).toLocaleString("pt-BR", {maximumFractionDigits: 2})} <br />
          ou em 10x de R$ {(Math.floor((priceTotalProducts / 10) * 100) / 100).toLocaleString("pt-BR", {minimumFractionDigits: 2})} sem juros
        </p>
      </div>
      <div className="special">
        <label htmlFor="cupom_user">Você tem algum código de cupom?</label>
        <input type="text" name="cupom" id="cupom_user" placeholder="inserir código do cupom"/>
        <Link to="/">Quer comprar mais produtos?</Link>
      </div>
    </div>
  )
}

export default SummaryCart