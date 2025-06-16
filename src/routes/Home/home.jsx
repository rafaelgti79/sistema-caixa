import React from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../../context/AuthContext';

import './home.css';

const url = "http://localhost:3000/caixa";

function Home() {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const { user } = useAuth();
  const { data: caixas } = useFetch(`http://localhost:3000/caixa?usuario=${usuarioLogado.nome}`);

  //const { data: conta } = useFetch('http://localhost:3000/conta');
  const { data: items } = useFetch(url);


  if (!user) return null; // Segurança: aguarda login

  const tipo = user.tipo;

  return (
    <div className="containerhome">
      <div className="colunatabel">
        {/* Acesso geral */}
        

        {(tipo === "admin" || tipo === "caixa") && (
          <>
            <Link to="/app/abrir-caixa">Abrir Caixa</Link>
            <Link to="/app/fechamento">Fechamento</Link>
          </>
        )}

        {tipo === "admin" && (
          <>
            <Link to="/app/lista-maquinas">Lista de Máquinas</Link>
            <Link to="/app/cadastros">Cadastro Gerais</Link>
            <Link to="/app/relatorios">Relatório</Link>
            <Link to="/app/procurar-erros">Procurar Erros</Link>
            <Link to="/app/gerenciar-cozinha">Gerenciar Cozinha</Link>
            <Link to="/app/checar-leitura">Checar Leitura</Link>
            <Link to="/app/gerenciar-sistema">Gerenciar Sistema</Link>
            <Link to="/app/pagamento-superios">Pagamento Superior</Link>
            <Link to="/app/procurar-pagamentos">Procurar Pagamentos</Link>
          </>
        )}

        {(tipo === "admin" || tipo === "operador") && (
          <Link to="/app/despesas-extra">Despesas Extras</Link>
        )}
      </div>

      <div>
        <ul className="grid-list">
          {items && items.map((item) => (
            <li key={item.id} className="grid-item">
              <div className="grid-row"><span className="label">RAFAEL:</span> <span className="value">X</span></div>
              <div className="grid-row"><span className="label">DATA:</span> <span className="value">{item.data}</span></div>
              <div className="grid-row"><span className="label">SETOR:</span> <span className="value">SETOR {item.setor}</span></div>
              <div className="grid-row"><span className="label">FUNDO INICIAL:</span> <span className="value">R$: {item.fundoInicial}</span></div>
              <div className="grid-row"><span className="label">LOJA:</span> <span className="value">{item.loja}</span></div>
              <p>INFORMAÇÕES DO CAIXA</p>
              <div className="grid-row"><span className="label">Fechamento:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Despesas:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Reforço:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Cartões:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Cheques:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Vales:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Sangrias:</span> <span className="value">0</span></div>
              <p>PARCIAL DO CAIXA</p>
              <div className="grid-row"><span className="label">Arrecadações:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Pagamentos:</span> <span className="value">0</span></div>
              <div className="grid-row"><span className="label">Resultado parcial:</span> <span className="value">0</span></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
