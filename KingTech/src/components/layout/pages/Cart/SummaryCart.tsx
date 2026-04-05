import { useState } from "react";
import { Link } from "react-router-dom";

import { formatarMoeda } from "@/utils/formatCurrency.ts";

import type { ProductsInCart } from "@/types/products.ts";

import Button from "@/components/layout/Button.tsx";

interface SummaryCartProps {
  products: ProductsInCart[];
}

const SummaryCart = ({products}: SummaryCartProps) => {
  const priceTotalProducts = products?.reduce((acc, p) => acc + p.price, 0) || 0;
  const priceSubtotal = products?.reduce((acc, p) => acc + (p.prevPrice ?? 0), 0) || 0;
  const [valorFrete, setValorFrete] = useState(priceTotalProducts);

  const calcularFrete = (price: number) => {
    setValorFrete(price + 25);
  };

  return (
    <div className="summary-cart">
      <p><strong>Produtos: </strong>{products.length ?? 0}</p>
      <p className="subtotal">Subtotal: <span style={{opacity: "0.7"}}>{formatarMoeda(priceSubtotal)}</span></p>
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
        <span id="res">Valor com frete: {formatarMoeda(valorFrete)}</span>
      </div>
      <div className="info-price">
        <p className="value-pix">Á vista no pix em {formatarMoeda(priceTotalProducts * 0.70)}, economize <span style={{color: "#047973", fontWeight: "bold"}}>{formatarMoeda(priceTotalProducts - (priceTotalProducts * 0.70))} reais</span></p>
        <p className="value-card">Á vista no cartão da loja em {formatarMoeda(priceTotalProducts * 0.85)} <br />
          ou em 10x de {formatarMoeda(Math.floor((priceTotalProducts / 10) * 100) / 100)} sem juros
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