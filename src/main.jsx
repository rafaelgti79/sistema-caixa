import React from 'react';
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import Login from './routes/Login/login.jsx';
import { PrivateRoute } from './components/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Home from './routes/Home/home.jsx';
import Maquinas from './routes/Maquinas/maquinas.jsx';
import Jogos from './routes/Jogos/jogos.jsx';
import Loja from './routes/Lojas/lojas.jsx';
import CadastroCartao from './routes/CadastroCartoes/CadastroCartao.jsx';
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
import NaoAutorizado from './routes/NaoAutorizado/NaoAutorizado.jsx';
import HomeCaixa from './routes/HomeCaixa/HomeCaixa.jsx';
import Reforco from './routes/Reforco/reforco.jsx';
import Despesas from './routes/Despesas/despesas.jsx';
import { BloqueioCaixa } from './routes/BloqueioCaixa/BloqueioCaixa.jsx';
import HistoricoFechamentos from './routes/HistorioFechamento/HistoricoFechamento.jsx';
import Dinheiro from './routes/Dinheiro/Dinheiro.jsx';
import Cartao from './routes/Cartao/Cartao.jsx';
import FechamentoMaquinas from './routes/FechamentoMaquinas/FechamentoMaquinas.jsx';
import FechamentoIndividual from './routes/FechamentoMaquinas/FechamentoIndividual/FechamentoIndividual.jsx';
import RelatorioMainDespesas from './routes/RelatorioDespesas/relatorioMainDespesa.jsx';
import FecharCaixa from './routes/FecharCaixa/FecharCaixa.jsx';
import Sangria from './routes/Sangria/Sangria.jsx';
import FechamentoFinal from './routes/FechamentoFinal/FechamentoFinal.jsx';
import RelatorioDespesas from './routes/RelatorioDespesas/RelatorioDespesas.jsx';
import EditarMaquina from './routes/EditarMaquina/editarMaquina.jsx';
import RelatorioMaquinas from './routes/RelatorioMaquinas/RelatorioMaquinas.jsx';
import FiltroRelatorioMaquinas from './routes/RelatorioMaquinas/FiltroRelatorioMaquinas/FiltroRelatorioMaquinas.jsx';
import ResumoMaquinas from './routes/ResumoMaquinas/ResumoMaquinas.jsx';
import ResumoTotal from './routes/ResumoTotal/ResumoTotal.jsx';




const router = createBrowserRouter([
  {
      path: "/",
      element: <Login />,
      },

  {
    path: "/app",
    element: <App />,
    children: [
      { path: "/app/home", element: 
  <PrivateRoute allowed={["admin", "caixa"]}>
    <BloqueioCaixa>
      <Home />
    </BloqueioCaixa>
  </PrivateRoute> 
},

      { path: "/app/maquinas", element: <PrivateRoute allowed={["admin"]}><Maquinas /></PrivateRoute> },
      { path: "/app/jogos", element: <PrivateRoute allowed={["admin"]}><Jogos /></PrivateRoute> },
      { path: "/app/lojas", element: <PrivateRoute allowed={["admin"]}><Loja /></PrivateRoute> },
      { path: "/app/cadastrocartao", element: <PrivateRoute allowed={["admin"]}><CadastroCartao /></PrivateRoute> },
      { path: "/app/conta", element: <PrivateRoute allowed={["admin"]}><Conta /></PrivateRoute> },
      { path: "/app/cadastros", element: <PrivateRoute allowed={["admin"]}><Cadastro /></PrivateRoute> },
      { path: "/app/despesas-extra", element: <PrivateRoute allowed={["admin", "operador", "caixa"]}><DespesasExtras /></PrivateRoute> },
      { path: "/app/gerenciar-cozinha", element: <PrivateRoute allowed={["admin"]}><GerenciarCozinha /></PrivateRoute> },
      { path: "/app/cozinha-add-produto", element: <PrivateRoute allowed={["admin"]}><CozinhaAddProduto /></PrivateRoute> },
      { path: "/app/cozinha-add-categoria", element: <PrivateRoute allowed={["admin"]}><CozinhaAddCategoria /></PrivateRoute> },
      { path: "/app/cozinha-produtos", element: <PrivateRoute allowed={["admin"]}><CozinhaProdutos /></PrivateRoute> },
      { path: "/app/cozinha-relatorio", element: <PrivateRoute allowed={["admin"]}><CozinhaRelatorio /></PrivateRoute> },
      { path: "/app/abrir-caixa", element: <PrivateRoute allowed={["admin", "caixa"]}><BloqueioCaixa><AbrirCaixa /></BloqueioCaixa></PrivateRoute> },
      { path: "/app/lista-maquinas", element: <PrivateRoute allowed={["admin"]}><ListaMaquinas /></PrivateRoute> },
      { path: "/app/relatorios", element: <PrivateRoute allowed={["admin"]}><Relatorios /></PrivateRoute> },
      { path: "/app/fechamento", element: <PrivateRoute allowed={["admin", "caixa"]}><Fechamento /></PrivateRoute> },
      { path: "/app/procurar-erros", element: <PrivateRoute allowed={["admin"]}><ProcurarErros /></PrivateRoute> },
      { path: "/app/checar-leitura", element: <PrivateRoute allowed={["admin"]}><ChecarLeitura /></PrivateRoute> },
      { path: "/app/gerenciar-sistema", element: <PrivateRoute allowed={["admin"]}><GerenciarSistema /></PrivateRoute> },
      { path: "/app/pagamento-superios", element: <PrivateRoute allowed={["admin"]}><PagamentosSuperios /></PrivateRoute> },
      { path: "/app/procurar-pagamentos", element: <PrivateRoute allowed={["admin"]}><ProcurarPagamentos /></PrivateRoute> },
      { path: "/app/home-caixa", element: <PrivateRoute allowed={["admin", "operador", "caixa"]}><BloqueioCaixa><HomeCaixa/></BloqueioCaixa></PrivateRoute> },
      { path: "/app/reforco", element: <PrivateRoute allowed={["admin", "operador", "caixa"]}><Reforco/></PrivateRoute> },
      { path: "/app/despesas", element: <PrivateRoute allowed={["admin", "operador", "caixa"]}><Despesas/></PrivateRoute> },
      { path: "/app/fecharcaixa", element: <PrivateRoute allowed={["admin", "operador", "caixa"]}><FecharCaixa/></PrivateRoute> },
      { path: "/app/historicofechamento", element: <PrivateRoute allowed={["admin" ]}><HistoricoFechamentos/></PrivateRoute> },
      { path: "/app/dinheiro", element: <PrivateRoute allowed={["admin", "caixa" ]}><Dinheiro/></PrivateRoute> },
      { path: "/app/cartao", element: <PrivateRoute allowed={["admin", "caixa" ]}><Cartao/></PrivateRoute> },
      { path: "/app/sangria", element: <PrivateRoute allowed={["admin", "caixa" ]}><Sangria/></PrivateRoute> },
      { path: "/app/fechamentomaquinas", element: <PrivateRoute allowed={["admin", "caixa" ]}><FechamentoMaquinas/></PrivateRoute> },
      { path: "/app/fechamento/final", element: <PrivateRoute allowed={["admin", "caixa" ]}><FechamentoFinal/></PrivateRoute> },
      { path: "/app/fechamentoindividual", element: <PrivateRoute allowed={["admin", "caixa" ]}><FechamentoIndividual/></PrivateRoute> },
      { path: "/app/relatoriomaindespesas", element: <PrivateRoute allowed={["admin" ]}><RelatorioMainDespesas/></PrivateRoute> },
      { path: "/app/relatoriodespesas", element: <PrivateRoute allowed={["admin"]}><RelatorioDespesas/></PrivateRoute> },
      { path: "/app/editarmaquina/:id", element: <PrivateRoute allowed={["admin"]}><EditarMaquina/></PrivateRoute> },
      { path: "/app/relatoriomaquinas", element: <PrivateRoute allowed={["admin"]}><RelatorioMaquinas/></PrivateRoute> },
      { path: "/app/filtrorelatoriomaquina", element: <PrivateRoute allowed={["admin"]}><FiltroRelatorioMaquinas/></PrivateRoute> },
      { path: "/app/resumomaquinas", element: <PrivateRoute allowed={["admin"]}><ResumoMaquinas/></PrivateRoute> },
      { path: "/app/resumototal", element: <PrivateRoute allowed={["admin"]}><ResumoTotal/></PrivateRoute> },
      { path: "/app/nao-autorizado", element: <PrivateRoute><NaoAutorizado /></PrivateRoute> },

      
    ]
  },
], {
  basename: '/sistema-caixa',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* ⛔ NÃO coloque nada com hooks do react-router aqui */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
