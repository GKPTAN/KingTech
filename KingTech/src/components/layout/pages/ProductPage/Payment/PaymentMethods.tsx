import { useState } from "react";
import { CiCreditCard2 } from "react-icons/ci";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPix } from "@fortawesome/free-brands-svg-icons";

import Button from "@/components/layout/Button.tsx";

enum PaymentMethod {
  STORE_CARD = "storeCard",
  OTHER_CARDS = "otherCards",
  PIX = "pix",
  BOLETO = "boleto",
}

interface PaymentMethodsProps {
  prevPrice: number | null;
  priceInCardStore: number | null;
  pricePartInCardStore: number;
  pricePix: number | null;
}

interface Installments {
  number: number;
  value: string;
  total: string;
}

const PaymentMethods = ({
  prevPrice,
  priceInCardStore,
  pricePartInCardStore,
  pricePix,
}: PaymentMethodsProps) => {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>(PaymentMethod.STORE_CARD);

  // função para calcular as parcelas
  const getInstallments = (total: number, max = 10) => {
    const result: Installments[] = [];
    for (let i = 1; i <= max; i++) {
      result.push({
        number: i,
        value: (total / i).toFixed(2),
        total: total.toFixed(2),
      });
    }
    return result;
  };

  // parcelas outros cartões (usando preço original)
  const otherCardInstallments = getInstallments(prevPrice ?? 0, 10);

  return (
    <div className="payment-methods" id="payment-methods">
      <h2>Formas de pagamento</h2>

      {/* Abas de seleção */}
      <div className="tabs">
        <Button
          type="button"
          nameAction="Cartão da Loja"
          className={activeMethod === PaymentMethod.STORE_CARD ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod(PaymentMethod.STORE_CARD)}
          icon={""}
        />
        <Button
          type="button"
          nameAction="Demais Cartões"
          className={activeMethod === PaymentMethod.OTHER_CARDS ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod(PaymentMethod.OTHER_CARDS)}
          icon={<CiCreditCard2 size={30} />}
        />
        <Button
          type="button"
          nameAction="Pix"
          className={activeMethod === PaymentMethod.PIX ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod(PaymentMethod.PIX)}
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
          className={activeMethod === PaymentMethod.BOLETO ? "active" : ""}
          disabled={false}
          onClick={() => setActiveMethod(PaymentMethod.BOLETO)}
          icon={
            <img src="/image/boleto-preto.png" alt="Boleto" title="Boleto" />
          }
        />
      </div>

      {/* Conteúdo do método selecionado */}
      <div className="method-content">
        {activeMethod === PaymentMethod.STORE_CARD && (
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
                  <td>R$ {priceInCardStore?.toFixed(2) ?? ""}</td>
                  <td>R$ {priceInCardStore?.toFixed(2) ?? ""}</td>
                </tr>
                {priceInCardStore && Array.from({ length: 9 }, (_, i) => {
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

        {activeMethod === PaymentMethod.OTHER_CARDS && (
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
              {prevPrice && (
                <tbody>
                  {otherCardInstallments.map((item) => (
                    <tr key={item.number}>
                      <td>{item.number}x</td>
                      <td>R$ {item.value}</td>
                      <td>R$ {item.total}</td>
                    </tr>
                  ))}
              </tbody>
              )}
            </table>
          </>
        )}

        {activeMethod === PaymentMethod.PIX && (
          <div className="pix">
            <h3>Pix</h3>
            <p>
              Valor com desconto: <strong>R$ {pricePix?.toFixed(2) ?? ""}</strong>
            </p>
          </div>
        )}

        {activeMethod === PaymentMethod.BOLETO && (
          <div className="boleto">
            <h3>Boleto Bancário</h3>
            <p>
              Valor: <strong>R$ {prevPrice?.toFixed(2) ?? ""}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
