import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App.jsx';
import './index.css';

import Home from './routes/Home/home.jsx';
import Maquinas from './routes/Maquinas/maquinas.jsx';
import Jogos from './routes/Jogos/jogos.jsx';
import Loja from './routes/Lojas/lojas.jsx';
import Cartão from './routes/Cartoes/cartao.jsx';
import Conta from './routes/Contas/contas.jsx';
import Cadastro from './routes/CadastrosGerais/cadastro.jsx';
import DespesasExtras from './routes/DespesasExtras/despesa-extra.jsx';
import GerenciarCozinha from './routes/GerenciarCozinha/GerenciarCozinha.jsx';
import CozinhaAddProduto from './routes/GerenciarCozinha/Cozinha-add-produto.jsx';
import CozinhaAddCategoria from './routes/GerenciarCozinha/Cozinha-add-categoria.jsx';


import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
      path: "/maquinas",
      element: <Maquinas />,
      },
      {
      path: "/jogos",
      element: <Jogos />,
      },
       {
      path: "/lojas",
      element: <Loja />,
       },
      {
      path: "/cartoes",
      element: <Cartão />,
      },
      {
      path: "/conta",
      element: <Conta />,
      },
      {
      path: "/cadastros",
      element: <Cadastro />,
      },
      {
      path: "/despesas-extra",
      element: <DespesasExtras />,
      },
      {
      path: "/gerenciar-cozinha",
      element: <GerenciarCozinha />,
      },
      {
      path: "/cozinha-add-produto",
      element: <CozinhaAddProduto />,
      },
      {
      path: "/cozinha-add-categoria",
      element: <CozinhaAddCategoria />,
      },

    ]
    
  },
],{
   basename: '/sistema-caixa',
});
  
      


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);