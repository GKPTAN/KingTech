import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { TbHomeFilled, TbHeartFilled, TbCrown } from 'react-icons/tb';
import { RiAccountBoxFill, RiShoppingBasketFill } from 'react-icons/ri';
import { MdList } from 'react-icons/md';
import logo from '../assets/logo.png';
import Search from "./Search";

const Navbar = () => {

  const linkRef = useRef(null);

  useEffect(() => {
    if (linkRef.current) {
      linkRef.current.focus();
    }
  }, []);

  return (
    <nav className="navbar">
        <img src={logo} alt="logomarca da loja KingTech" />
        <Search />
        <ul>
            <li><Link to="/favorites"><TbCrown id="crown" /><TbHeartFilled />Favoritos</Link></li>
            <li><Link to="/account"><TbCrown id="crown" /><RiAccountBoxFill />Conta</Link></li>
            <li><Link to="/" ref={linkRef}><TbCrown id="crown" /><TbHomeFilled />Home</Link></li>
            <li><Link to="/cart"><TbCrown id="crown" /><RiShoppingBasketFill />Cesta</Link></li>
            <li><Link to="/departments"><TbCrown id="crown" /><MdList />Departamentos</Link></li>
        </ul>
    </nav>  
  );
};

export default Navbar