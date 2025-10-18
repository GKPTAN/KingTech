import { Outlet, Link } from 'react-router-dom';
import styles from "../style/Account.module.css";

const Account = () => {
  return (
    <div className={styles.account}>
      <title>Conta</title>
      <Outlet />
    </div>
  );
};

export default Account