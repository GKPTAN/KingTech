import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.tsx';
import AuthGuard from './context/AuthGuard.tsx';
import Account from './routes/Account.tsx';
import Cart from './routes/Cart.tsx';
import Departments from './routes/Departments.tsx';
import Error404 from './routes/Error404.tsx';
import Favorites from './routes/Favorites.tsx';
import Home from './routes/Home.tsx';
import Support from './routes/Support.tsx';
import Admin from './routes/Admin.tsx';
import Login from './pages/account/Login.tsx';
import Registro from './pages/account/Registro.tsx';
import Dashboard from './pages/account/Dashboard.tsx';
import ProductPage from './routes/ProductPage.tsx';
import DepartmentPage from './pages/departments/DepartmentPage.tsx';
import './index.css';
import App from './App.tsx';

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
        element: (
          <AuthGuard roles={["admin"]}>
            <Admin />
          </AuthGuard>
        ),
      },
      {
        path: "/product/:id/:name",
        element: <ProductPage />,
      }
    ],
  },
]);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
};

createRoot(container).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
