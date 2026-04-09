import { MdList } from "react-icons/md";
import { RiAccountBoxFill, RiShoppingBasketFill } from "react-icons/ri";
import { TbCrown, TbHeartFilled, TbHomeFilled } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";

import { useWidthWindow } from "@/hooks/useWindowWidth.tsx";

import Search from "./Search.tsx";

import logo from "@/assets/logo.png";

interface NavbarProps {
  img?: boolean;
  search: boolean;
  nav: boolean;
  isNavMobile: boolean;
}

const Navbar = ({ img, search, nav, isNavMobile }: NavbarProps) => {

  const location = useLocation();
  let widthWindow = useWidthWindow();
  let mediaQuery = 0;

  if (widthWindow <= 768) {
    mediaQuery = 25;
  }

  return (
    <nav className={`navbar ${isNavMobile ? "nav-bottom" : ""}`}>
      {img && <img src={logo} alt="logomarca da loja KingTech" />}
      {search && <Search />}
      {nav && (
        <ul>
          <li>
            <Link
              to="/favorites"
              className={location.pathname === "/favorites" ? "active" : ""}
            >
              <TbCrown id="crown" />
              <TbHeartFilled size={mediaQuery} />
              Favoritos
            </Link>
          </li>
          <li>
            <Link
              to="/account/login"
              className={
                location.pathname.startsWith("/account") ? "active" : ""
              }
            >
              <TbCrown id="crown" />
              <RiAccountBoxFill size={mediaQuery} />
              Conta
            </Link>
          </li>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <TbCrown id="crown" size={mediaQuery} />
              <TbHomeFilled size={mediaQuery} />
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/cart"
              className={location.pathname === "/cart" ? "active" : ""}
            >
              <TbCrown id="crown" />
              <RiShoppingBasketFill size={mediaQuery} />
              Cesta
            </Link>
          </li>
          <li>
            <Link
              to="/departments"
              className={
                location.pathname.startsWith("/departments") ? "active" : ""
              }
            >
              <TbCrown id="crown" />
              <MdList size={mediaQuery} />
              Departamentos
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
