import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { MdLocalOffer } from 'react-icons/md';
import { BsEmojiSmile } from 'react-icons/bs';
import { LuCrown } from 'react-icons/lu';
import { FaHandPaper } from 'react-icons/fa';
import ProductCard from '../components/layout/ProductCard';
import '../style/Favorites.css';

const favorites = [
  
]

const Favorites = () => {

  const { user } = useAuth();

  return (
    <div className="favorites">
        <title>Favoritos</title>
        {!user && (
          <div className='anon'>
          <h2>Calma aí campeão <span className='emoji'><LuCrown /><BsEmojiSmile /></span><FaHandPaper style={{marginLeft: "-8px"}}/></h2>
          <div>
            <Link className='login-link' to="/account/login">Faça login</Link>
            <Link className='register-link' to="/account/register">Não tem uma conta? Registra-se</Link>
          </div>
        </div>
        )}
        {user && favorites.length > 0 && (
          <div className='favorites-box'>
            <ul className='favorites-list'>
              {favorites && favorites.map((favorite) => (
                <li key={favorite.id} className='favorite-item'>
                  <ProductCard 
                    mode='landscape'
                    name={favorite.name}
                    id={favorite.id}
                    img={favorite.img}
                    price={favorite.price}
                    alt={favorite.alt}
                    prevPrice={favorite.prevPrice}
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