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

import Login from './routes/Login/login.jsx';
import { PrivateRoute } from './components/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
      path: "/",
      element: <Login />,
      },

  {
    path: "/app",
    element: <App />,
    children: [
      { path: "/app/home", element: <PrivateRoute><Home /></PrivateRoute> },
      { path: "/app/maquinas", element: <PrivateRoute><Maquinas /></PrivateRoute> },
      { path: "/app/jogos", element: <PrivateRoute><Jogos /></PrivateRoute> },
      { path: "/app/lojas", element: <PrivateRoute><Loja /></PrivateRoute> },
      { path: "/app/cartoes", element: <PrivateRoute><Cartão /></PrivateRoute> },
      { path: "/app/conta", element: <PrivateRoute><Conta /></PrivateRoute> },
      { path: "/app/cadastros", element: <PrivateRoute allowed={["admin"]}><Cadastro /></PrivateRoute> },
      { path: "/app/despesas-extra", element: <PrivateRoute allowed={["admin", "operador"]}><DespesasExtras /></PrivateRoute> },
      { path: "/app/gerenciar-cozinha", element: <PrivateRoute><GerenciarCozinha /></PrivateRoute> },
      { path: "/app/cozinha-add-produto", element: <PrivateRoute><CozinhaAddProduto /></PrivateRoute> },
      { path: "/app/cozinha-add-categoria", element: <PrivateRoute><CozinhaAddCategoria /></PrivateRoute> },
      { path: "/app/cozinha-produtos", element: <PrivateRoute><CozinhaProdutos /></PrivateRoute> },
      { path: "/app/cozinha-relatorio", element: <PrivateRoute><CozinhaRelatorio /></PrivateRoute> },
      { path: "/app/abrir-caixa", element: <PrivateRoute><AbrirCaixa /></PrivateRoute> },
      { path: "/app/lista-maquinas", element: <PrivateRoute><ListaMaquinas /></PrivateRoute> },
      { path: "/app/relatorios", element: <PrivateRoute><Relatorios /></PrivateRoute> },
      { path: "/app/fechamento", element: <PrivateRoute><Fechamento /></PrivateRoute> },
      { path: "/app/procurar-erros", element: <PrivateRoute><ProcurarErros /></PrivateRoute> },
      { path: "/app/checar-leitura", element: <PrivateRoute><ChecarLeitura /></PrivateRoute> },
      { path: "/app/gerenciar-sistema", element: <PrivateRoute><GerenciarSistema /></PrivateRoute> },
      { path: "/app/pagamento-superios", element: <PrivateRoute><PagamentosSuperios /></PrivateRoute> },
      { path: "/app/procurar-pagamentos", element: <PrivateRoute><ProcurarPagamentos /></PrivateRoute> },
      
    ]
  },
], {
  basename: '/sistema-caixa',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
