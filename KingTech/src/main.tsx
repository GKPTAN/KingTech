import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from './context/AuthContext';
import AppAdmin from './AppAdmin';
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
import App from './App';

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
        path: "/product/:id/:name",
        element: <ProductPage />,
      }
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthGuard roles={["admin"]}>
        <AppAdmin />
      </AuthGuard>
    ),
    errorElement: <Error404 />,
    children: [
      {
        path: "",
        element: <Admin />
      }
    ]
  }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
    },
  },
});

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
};

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
