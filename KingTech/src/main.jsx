import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './context/AuthGuard';
import Account from './routes/Account';
import Cart from './routes/Cart';
import Departments from './routes/Departments';
import Error404 from './routes/Error404';
import Favorites from './routes/Favorites';
import Home from './routes/Home';
import Support from './routes/Support';
import Admin from './routes/Admin';
import Login from './pages/account/Login';
import Registro from './pages/account/Registro';
import Dashboard from './pages/account/Dashboard';
import ProductPage from './routes/ProductPage';
import DepartmentPage from './pages/departments/DepartmentPage';
import './index.css';
import App from './App.jsx';

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
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Registro />,
          },
          {
            path: "dashboard",
            element: (
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            ),
          },
        ],
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
        path: "/departments/:department/:subcategory",
        element: <DepartmentPage />,
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
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/product/:id/:name",
        element: <ProductPage />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
