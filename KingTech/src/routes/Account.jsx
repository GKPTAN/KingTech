import { Outlet } from 'react-router-dom';
import '../style/Account.css';

const Account = () => {
  return (
    <div className='account'>
      <title>Conta</title>
        <Outlet />
    </div>
  );
};

export default Account