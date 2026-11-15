import { Outlet, ScrollRestoration } from "react-router-dom";

import { useAuth } from "./context/useAuth";
import GlobalMessenger from "./components/GlobalMessenger";

import "@/App.css";

const AppAdmin = () => {
  const { globalStatus, globalMessage } = useAuth();  
  return (
    <div className="App">
        <ScrollRestoration />
        <GlobalMessenger status={globalStatus} message={globalMessage}/>

        <Outlet />
    </div>
  )
}

export default AppAdmin