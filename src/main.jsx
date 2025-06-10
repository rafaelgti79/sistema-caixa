import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App.jsx';
import './index.css';

import Cadastro from './routes/cadastro.jsx';


import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
], {
   basename: '/sistema-caixa',
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);