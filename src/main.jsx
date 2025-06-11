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
import CozinhaProdutos from './routes/GerenciarCozinha/Produtos.jsx';
import CozinhaRelatorio from './routes/GerenciarCozinha/Cozinha-relatorio.jsx';
import AbrirCaixa from './routes/AbrirCaixa/AbrirCaixa.jsx';
import ListaMaquinas from './routes/ListaMaquinas/ListaMaquinas.jsx';
import Relatorios from './routes/Relatorios/Relatorios.jsx';
import Fechamento from './routes/Fechamento/fechamento.jsx';
import ProcurarErros from './routes/ProcurarErros/ProcurarErros.jsx';
import ChecarLeitura from './routes/ChecarLeitura/ChecarLeitura.jsx';
import GerenciarSistema from './routes/GerenciarSistema/GerenciarSistema.jsx';
import PagamentosSuperios from './routes/PagamentosSuperiores/PagamentosSuperiores.jsx';
import ProcurarPagamentos from './routes/ProcurarPagamentos/ProcurarPagamentos.jsx';


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
      {
      path: "/cozinha-produtos",
      element: <CozinhaProdutos />,
      },
      {
      path: "/cozinha-relatorio",
      element: <CozinhaRelatorio />,
      },
      {
      path: "/abrir-caixa",
      element: <AbrirCaixa />,
      },
      {
      path: "/lista-maquinas",
      element: <ListaMaquinas />,
      },
      {
      path: "/relatorios",
      element: <Relatorios />,
      },
      {
      path: "/fechamento",
      element: <Fechamento />,
      },
      {
      path: "/procurar-erros",
      element: <ProcurarErros />,
      },
      {
      path: "/checar-leitura",
      element: <ChecarLeitura />,
      },
      {
      path: "/gerenciar-sistema",
      element: <GerenciarSistema />,
      },
      {
      path: "/pagamento-superios",
      element: <PagamentosSuperios />,
      },
      {
      path: "/procurar-pagamentos",
      element: <ProcurarPagamentos />,
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