import { TbCrown } from 'react-icons/tb';
import '@/style/Error404.css';

const Error404 = () => {
  return (
    <div className='error_page'>
        <title>Error 404</title>
        <h1><TbCrown />404</h1>
        <p>Página não encontrada</p>
        <button onClick={() => {window.history.back()}}>Voltar para a página anterior</button>
    </div>
  );
};

export default Error404