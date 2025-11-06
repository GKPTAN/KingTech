import { Outlet } from 'react-router-dom';
import { useWidthWindow } from './hooks/useWindowWidth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {

  let widthWindow = useWidthWindow();

  return (
    <>
      <div className="App">
        {widthWindow > 650 ? 
          (<Navbar img={true} search={true} nav={true}/>) 
          :
          (<Navbar img={true} search={true} nav={false}/>)
        }
        <Outlet />
        {widthWindow > 650 ? 
          (<Footer />) 
          : 
          (<Navbar img={false} search={false} nav={true}/>)
        }
      </div>
    </>
  )
}

export default App
