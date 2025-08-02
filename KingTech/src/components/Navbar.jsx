import { Link, useLocation } from "react-router-dom";
import { TbHomeFilled, TbHeartFilled, TbCrown } from 'react-icons/tb';
import { RiAccountBoxFill, RiShoppingBasketFill } from 'react-icons/ri';
import { MdList } from 'react-icons/md';
import logo from '../assets/logo.png';
import Search from "./Search";

const Navbar = () => {

  const location = useLocation();

  return (
    <nav className="navbar">
        <img src={logo} alt="logomarca da loja KingTech" />
        <Search />
        <ul>
            <li><Link to="/favorites" className={location.pathname === "/favorites" ? "active" : ""}><TbCrown id="crown" /><TbHeartFilled />Favoritos</Link></li>
            <li><Link to="/account" className={location.pathname.startsWith("/account") ? "active" : ""}><TbCrown id="crown" /><RiAccountBoxFill />Conta</Link></li>
            <li><Link to="/" className={location.pathname === "/" ? "active" : ""}><TbCrown id="crown" /><TbHomeFilled />Home</Link></li>
            <li><Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}><TbCrown id="crown" /><RiShoppingBasketFill />Cesta</Link></li>
            <li><Link to="/departments" className={location.pathname === "/departments" ? "active" : ""}><TbCrown id="crown" /><MdList />Departamentos</Link></li>
        </ul>
    </nav>  
  );
};

export default Navbar