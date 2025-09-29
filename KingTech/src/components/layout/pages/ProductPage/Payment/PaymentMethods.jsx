import { useState } from "react";
import { CiCreditCard2 } from "react-icons/ci";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons";
import Button from "../../../Button";

const PaymentMethods = ({
  prevPrice,
  priceInCardStore,
  pricePartInCardStore,
  pricePix,
}) => {
  const [activeMethod, setActiveMethod] = useState("storeCard");

  // função para calcular as parcelas
  const getInstallments = (total, max = 10) => {
    const result = [];
    for (let i = 1; i <= max; i++) {
      result.push({
        number: i,
        value: (total / i).toFixed(2),
        total: total.toFixed(2),
      });
    }
    return result;
  };

  // parcelas cartão da loja
  const storeCardInstallments = getInstallments(priceInCardStore, 10);
  // parcelas outros cartões (usando preço original)
  const otherCardInstallments = getInstallments(prevPrice, 10);

  return (
    <div className="payment-methods" id="payment-methods">
      <h2>Formas de pagamento</h2>

      {/* Abas de seleção */}
      <div className="tabs">
        <Button
          type="button"
          nameAction="Cartão da Loja"
          className={activeMethod === "storeCard" ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod("storeCard")}
          icon={""}
        />
        <Button
          type="button"
          nameAction="Demais Cartões"
          className={activeMethod === "otherCards" ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod("otherCards")}
          icon={<CiCreditCard2 size={30} />}
        />
        <Button
          type="button"
          nameAction="Pix"
          className={activeMethod === "pix" ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod("pix")}
          icon={
            <FontAwesomeIcon
              icon={faPix}
              style={{ width: "25px", height: "25px", color: "#4CB8A9" }}
            />
          }
        />
        <Button
          type="button"
          nameAction="Boleto"
          className={activeMethod === "boleto" ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod("boleto")}
          icon={
            <img src="/image/boleto-preto.png" alt="Boleto" title="Boleto" />
          }
        />
      </div>

      {/* Conteúdo do método selecionado */}
      <div className="method-content">
        {activeMethod === "storeCard" && (
          <>
            <h3>Cartão da Loja</h3>
            <table>
              <thead>
                <tr>
                  <th>Parcelas</th>
                  <th>Valor</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1x</td>
                  <td>R$ {priceInCardStore.toFixed(2)}</td>
                  <td>R$ {priceInCardStore.toFixed(2)}</td>
                </tr>
                {Array.from({ length: 9 }, (_, i) => {
                  const parcela = i + 2; // começa no 2
                  const valor = (pricePartInCardStore / parcela).toFixed(2);
                  return (
                    <tr key={parcela}>
                      <td>{parcela}x</td>
                      <td>R$ {valor}</td>
                      <td>R$ {pricePartInCardStore.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {activeMethod === "otherCards" && (
          <>
            <h3>Demais Cartões</h3>
            <table>
              <thead>
                <tr>
                  <th>Parcelas</th>
                  <th>Valor</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {otherCardInstallments.map((item) => (
                  <tr key={item.number}>
                    <td>{item.number}x</td>
                    <td>R$ {item.value}</td>
                    <td>R$ {item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeMethod === "pix" && (
          <div className="pix">
            <h3>Pix</h3>
            <p>
              Valor com desconto: <strong>R$ {pricePix.toFixed(2)}</strong>
            </p>
          </div>
        )}

        {activeMethod === "boleto" && (
          <div className="boleto">
            <h3>Boleto Bancário</h3>
            <p>
              Valor: <strong>R$ {prevPrice.toFixed(2)}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
