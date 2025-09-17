import { CiCreditCard2, CiFacebook } from 'react-icons/ci';
import { PaymentIcon } from 'react-svg-credit-card-payment-icons/dist/index.mjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPix } from '@fortawesome/free-brands-svg-icons';
import { PiInstagramLogoDuotone, PiYoutubeLogo } from 'react-icons/pi';
import { LiaWhatsapp } from 'react-icons/lia';
import Logo from '../assets/logo.png';
import styles from '../style/components/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
        <div className={styles.logo}>
            <img src={Logo} alt="logo da loja" />
        </div>
        <div className={styles.pay_methods}>
            <h2>Formas de Pagamento</h2>
            <ul className={styles.pay_methods_list}>
                <li className={styles.icon_pay}><CiCreditCard2 className={styles.credit} aria-label='Cartão de Crédito ou Débito' title='Cartão de Crédito ou Débito'/></li>
                <li title='Mastercard'><PaymentIcon type='Mastercard' format='flatRounded' width={100} aria-label='Mastercard'/></li>
                <li title='Visa'><PaymentIcon type='Visa' format='flatRounded' width={100} aria-label='Visa'/></li>
                <li title='Elo'><PaymentIcon type='Elo' format='flatRounded' width={100} aria-label='Elo'/></li>
                <li className={styles.icon_pay}><img src="/image/boleto.png" alt="Boleto" title='Boleto'/></li>
                <li className={styles.pix} aria-label='Pix' title='Pix'><FontAwesomeIcon icon={faPix} style={{width: "100px", height: "64px", color: "#4CB8A9"}}/></li>
            </ul>
        </div>
        <hr />
        <div className={styles.informations}>
            <ul className={styles.info_list}>
                <li><h3>Dúvidas</h3></li>
                <li>Politica do site</li>
                <li>Formas de pagamento</li>
                <li>Trocas e devoluções</li>
                <li>Processo de entrega</li>
            </ul>
            <ul className={styles.info_list}>
                <li><h3>Serviços</h3></li>
                <li>Vale Presente</li>
                <li>Cartão KingTech</li>
                <li>KingTech Seguros</li>
                <li>Garantia estendida</li>
                <li>instalação e montagem</li>
            </ul>
            <ul className={styles.info_list}>
                <li><h3>Institucional</h3></li>
                <li>Quem somos</li>
                <li>investidores</li>
                <li>Politica de privacidade</li>
                <li>Termos e condições</li>
            </ul>
            <ul className={styles.info_list}>
                <li><h3>Parcerias</h3></li>
                <li>Seja nosso parceiro</li>
            </ul>
            <ul className={styles.info_list}>
                <li><h3>Central de atendimento</h3></li>
                <li>Arrependimento ou desistência</li>
                <li>Politica de entrega</li>
                <li>Fale conosco</li>
                <li>Termo de compra e venda</li>
            </ul>
            <ul className={styles.info_list}>
                <li><h3>Atribuições</h3></li>
                <li className={styles.icon_link}><a target="_blank" href="https://icons8.com/icon/F77TABNQzR3w/boleto-banc%C3%A1rio">Boleto</a> ícone por <a target="_blank" href="https://icons8.com">Icons8</a></li>
            </ul>
        </div>
        <hr />
        <div className={styles.copy}>
            <p>Kingtech - CNPJ 01.001.001/0001-01</p>
            <p>Av. Santista, 2050 - CEP 01001-001 São Paulo/São Paulo</p>
            <ul className={styles.social_medias_list}>
                <li><a href="https://instagram.com/gkapitan07" target='_blank' rel='noopener noreferrer'><PiInstagramLogoDuotone fill='#D308BE' size={40} /></a></li>
                <li><a href="#"><CiFacebook fill='#086CFF' size={40} /></a></li>
                <li><a href="#"><LiaWhatsapp fill='#2BD46A' size={40}/></a></li>
                <li><a href="#"><PiYoutubeLogo fill='#FE0838' size={40} /></a></li>
            </ul>
            <p>&copy; 2025 KingTech, todos os direitos reservados. Esse app é uma loja fictícia e foi desenvolvido apenas para fins de portfólio.</p>
            <p>Desenvolvido por Guilherme Amorim</p>
        </div>
    </footer>
  );
};

export default Footer