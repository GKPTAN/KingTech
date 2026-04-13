import { Link } from 'react-router-dom';
// import { useContext } from 'react';
import { MdLocalOffer } from 'react-icons/md';

import { useWidthWindow } from '@/hooks/useWindowWidth';

// import { useAuth } from '@/context/useAuth.ts';
 
import { CardMode } from '@/types/products';

import ProductCard from '@/components/layout/ProductCard';

import '@/style/Favorites.css';
import '@/style/responsive/routes/Favorites/Favorites.responsive.css';

const favorites = [
  {
    id: 0,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 1,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 2,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 3,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 4,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 5,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 6,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
  {
    id: 7,
    name: "Produto",
    img: "https://placehold.co/150x150/jpg",
    prevPrice: "",
    price: 999.99,
    alt: "imagem do produto",
  },
]

const Favorites = () => {

  let widthWindow = useWidthWindow();

  // const { user } = useAuth();
  const user = true;

  return (
    <div className="favorites">
        <title>Favoritos</title>
        {!user && (
          <div className='anon'>
            <h2>Você não iniciou a sua jornada, então...</h2>
            <div>
              <Link className='login-link' to="/account/login">Faça login</Link>
              <Link className='register-link' to="/account/register">Não tem uma conta? Registra-se</Link>
            </div>
          </div>
        )}
        {user && favorites && favorites.length > 0 && (
          <div className='favorites-box'>
            <ul className='favorites-list'>
              {favorites && favorites.map((favorite) => (
                <li key={favorite.id} className='favorite-item'>
                  <ProductCard 
                    mode={widthWindow > 900 ? CardMode.LANDSCAPE : CardMode.PORTRAIT}
                    name={favorite.name}
                    id={favorite.id}
                    img={favorite.img}
                    price={favorite.price}
                    alt={favorite.alt}
                    prevPrice={Number(favorite.prevPrice) === 0 ? null : Number(favorite.prevPrice)}
                    button={false}
                    cart={false}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        {user && (favorites.length === 0 || !favorites) && (
          <div className="aviso">
            <h2>Você não tem favoritos</h2>
            <p> Ainda está pensando? favorite alguns produtos para se preparar para ofertas futuras.</p>
            <Link className="btn-aviso" to="/">Ver Produtos <MdLocalOffer size={20} /></Link>
          </div>
        )}
    </div>
  );
};

export default Favorites