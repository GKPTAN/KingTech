import { TiDelete } from "react-icons/ti";
import Button from "../../Button";

const ListProductsCart = ({products, remove}) => {
  return (
    <ul className="list-products-cart">
        {products.map((product) => (
            <li className="item" key={product.id}>
                <div className="product-cart">
                    <img src={product.img} alt={product.alt} />
                    <div className="info-prod">
                        <p className="brand">{product.brand}</p>
                        <h3 className="name-product">{product.name}</h3>
                        <p className="code-product">Código do produto: {product.code}</p>
                        <div className="tags">
                            {product.tags.map((tag, index) => (
                                <span className="tag" key={index}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <Button 
                        type={"button"}
                        nameAction={`Remover`}
                        className="btn-remove-product"
                        disabled={false}
                        onClick={remove}
                        icon={<TiDelete size={30}/>}
                    />
                    {/* <div className="services">
                        <p>Serviços</p>
                        <ul className="list-services">
                            <li>
                                <input type="radio" name="switch-service" id="switch_service" checked/>
                                <label htmlFor="switch_service">Sem garantia</label>
                            </li>
                            <li>
                                <input type="radio" name="switch-service" id="switch_service_1"/>
                                <label htmlFor="switch_service_1">Garantia estendida - 12 meses em 12x de R$ 11,50</label>
                            </li>
                            <li>
                                <input type="radio" name="switch-service" id="switch_service_2"/>
                                <label htmlFor="switch_service_1">Garantia estendida - 24 meses em 24x de R$ 6,90</label>
                            </li>
                        </ul>
                    </div> */}
                    <div className="quantity">
                        <input type="number" name="quantity" id="quantity-product" min={0}/>
                        <label htmlFor="quantity-product">Quantidade</label>
                    </div>
                    <div className="info-payment">
                        {product.prevPrice && <p className="prev-price">R$ {(product.prevPrice).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</p>}
                        <p className="price">
                            R$ {(product.price).toLocaleString("pt-BR", {minimumFractionDigits: 2})} <br />
                            Á vista no PIX R$ {(product.pricePix).toLocaleString("pt-BR", {minimumFractionDigits: 2})} <br />
                            ou á vista no cartão R$ {(product.priceCard).toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                        </p>
                        <p>
                            ou em 10x de R$ {(Math.floor((product.price / 10) * 100) / 100).toLocaleString("pt-BR", {minimumFractionDigits: 2})} sem juros
                        </p>
                    </div>
                </div>
            </li>
        ))}
    </ul>
  );
};

export default ListProductsCart