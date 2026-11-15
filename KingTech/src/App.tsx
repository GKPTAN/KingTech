import { Outlet, ScrollRestoration } from 'react-router-dom';

import { useAuth } from './context/useAuth';
import { useWidthWindow } from './hooks/useWindowWidth';
import GlobalMessenger from './components/GlobalMessenger';
import LoadingPage from './components/layout/loading/LoadingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {

  let widthWindow = useWidthWindow();
  const { loading, globalStatus, globalMessage } = useAuth();

  if (loading) {
    return <LoadingPage />
  }

  return (
    <>
      <div className="App">
        <ScrollRestoration />
        <GlobalMessenger status={globalStatus} message={globalMessage}/>
        {widthWindow > 650 ? 
          (<Navbar img={true} search={true} nav={true} isNavMobile={false} hidden={loading ? true : false}/>) 
          :
          (<Navbar img={true} search={true} nav={false} isNavMobile={false} hidden={loading ? true : false}/>)
        }
        <Outlet />
        {widthWindow > 650 ? 
          (<Footer hidden={loading ? true : false}/>) 
          : 
          (<Navbar img={false} search={false} nav={true} isNavMobile={true} hidden={loading ? true : false}/>)
        }
      </div>
    </>
  )
}

export default App
