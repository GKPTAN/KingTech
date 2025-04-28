import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Account from './routes/Account'
import Cart from './routes/Cart'
import Departments from './routes/Departments'
import Error404 from './routes/Error404'
import Favorites from './routes/Favorites'
import Home from './routes/Home'
import Support from './routes/Support'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/departments",
        element: <Departments />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/oldcontact",
        element: <Navigate to="/support" />,
      },
      {
        path: "/support",
        element: <Support />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
