import { Link, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { LiaShoppingBasketSolid } from "react-icons/lia";
import { MdStarRate } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import { LuCrown } from "react-icons/lu";

import { useAuth } from "@/context/useAuth";

import AdminOnly from "@/components/AdminOnly";

import styles from "@/style/pages/auth/Dashboard.module.css";


const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/account/login");
  }

  return (
    <div className={styles.dashboard}>
      <ul className={styles.options}>
        <AdminOnly>
          <li className={styles.option}><LuCrown size={30}/> <Link to={"/admin"}>Administração</Link></li>
        </AdminOnly>
        <li className={styles.option}><CgProfile size={40}/> Perfil</li>
        <li className={styles.option}><LiaShoppingBasketSolid size={40}/> Meus pedidos</li>
        <li className={styles.option}><MdStarRate size={40}/> Avaliações</li>
        <li className={styles.option}><BsTrash fill="#d32f2f" size={40}/> Excluir conta</li>
        <li className={styles.option}>
          <button className={styles.exit} type="button" onClick={handleLogout}>
            <ImExit size={40}/> 
            <span>Sair</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard