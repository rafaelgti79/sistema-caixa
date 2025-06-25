// src/pages/HistoricoCaixa.jsx
import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import './HistorioFechamento.css';


function HistoricoCaixa() {
  const { data: historico } = useFetch('http://localhost:3000/historicocaixa');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);

  useEffect(() => {
    if (historico) {
      setHistoricoFiltrado(
        historico.filter(item =>
          (filtroUsuario === '' || item.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())) &&
          (filtroData === '' || item.data === filtroData)
        )
      );
    }
  }, [historico, filtroUsuario, filtroData]);

  return (
    <div className="containerDespesas">
      <h2>Histórico de Fechamentos</h2>

      <div className="filtros">
        <input
          type="text"
          placeholder="Filtrar por usuário"
          value={filtroUsuario}
          onChange={e => setFiltroUsuario(e.target.value)}
        />
        <input
          type="date"
          value={filtroData}
          onChange={e => setFiltroData(e.target.value)}
        />
      </div>

      <ul className="grid-list">
        {historicoFiltrado.length > 0 ? (
          historicoFiltrado.map((item, idx) => (
            <li key={idx} className="grid-item">
              <div className="grid-row"><span className="label">Data:</span><span className="value">{item.data}</span></div>
              <div className="grid-row"><span className="label">Usuário:</span><span className="value">{item.usuario}</span></div>
              <div className="grid-row"><span className="label">Total Entrada :</span><span className="value">R$ {Number(item.entrada).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Total de Saida:</span><span className="value">R$ {Number(item.saida).toFixed(2)}</span></div>
              <div className="grid-row linha-bruto"><span className="label">Resultado Bruto:</span><span className="value">R$ {Number(item.bruto).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Despesas:</span><span className="value">R$ {Number(item.despesas).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Resultado Liquido:</span><span className="value">R$ {Number(item.liquido).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Fundo Inicial:</span><span className="value">R$ {Number(item.fundoInicial).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Reforço:</span><span className="value">R$ {Number(item.reforco || 0).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Composição Total:</span><span className="value">R$ {Number(item.composicaoTotal || item.composicao).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Crédito:</span><span className="value">R$ {Number(item.cartaoCredito || 0).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Débito:</span><span className="value">R$ {Number(item.cartaoDebito || 0).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Pix:</span><span className="value">R$ {Number(item.cartaoPix || 0).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Dinheiro:</span><span className="value">R$ {Number(item.dinheiroLiquido || item.dinheiro).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Sangria:</span><span className="value">R$ {Number(item.sangria || 0).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Sobra:</span><span className="value">R$ {Number(item.sobra || 0).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Falta:</span><span className="value">R$ {Number(item.falta || 0).toFixed(2)}</span></div>
            </li>
          ))
        ) : (
          <p>Nenhum fechamento encontrado.</p>
        )}
      </ul>
    </div>
  );
}

export default HistoricoCaixa;


/* backup
import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';

function HistoricoCaixa() {
  const { data: historico } = useFetch('http://localhost:3000/historicocaixa');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);

  useEffect(() => {
    if (historico) {
      const filtrado = historico.filter(item => {
        const matchUsuario = filtroUsuario === '' || item.usuario.toLowerCase().includes(filtroUsuario.toLowerCase());
        const matchData = filtroData === '' || item.data === filtroData;
        return matchUsuario && matchData;
      });
      setHistoricoFiltrado(filtrado);
    }
  }, [historico, filtroUsuario, filtroData]);

  return (
    <div className="containerDespesas">
      <h2>Histórico de Fechamentos de Caixa</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Filtrar por usuário"
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
        />
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          style={{ marginLeft: '1rem' }}
        />
      </div>

      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Usuário</th>
            <th>Bruto</th>
            <th>Líquido</th>
            <th>Composição</th>
            <th>Sobra</th>
            <th>Falta</th>
            <th>Dinheiro</th>
          </tr>
        </thead>
        <tbody>
          {historicoFiltrado.map((item, index) => (
            <tr key={index}>
              <td>{item.data}</td>
              <td>{item.usuario}</td>
              <td>R$ {parseFloat(item.bruto).toFixed(2)}</td>
              <td>R$ {parseFloat(item.liquido).toFixed(2)}</td>
              <td>R$ {parseFloat(item.composicao).toFixed(2)}</td>
              <td>R$ {parseFloat(item.dinheiro).toFixed(2)}</td>
              <td style={{ color: 'green' }}>R$ {parseFloat(item.sobra).toFixed(2)}</td>
              <td style={{  }}>R$ {parseFloat(item.falta).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoricoCaixa;




/*

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import './HistoricoFechamento.css';


const urlFechamentos = "http://localhost:3000/caixa";
const urlCaixa = "http://localhost:3000/caixa"; // para buscar lojas existentes

function HistoricoFechamentos() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const { data: fechamentosData, httpConfig } = useFetch(urlFechamentos);
  const { data: caixasData } = useFetch(urlCaixa); // lojas existentes

  const [filtroData, setFiltroData] = useState('');
  const [filtroLoja, setFiltroLoja] = useState('');
  const [filtroSetor, setFiltroSetor] = useState('');
  const [fechamentosFiltrados, setFechamentosFiltrados] = useState([]);

  const [lojasUnicas, setLojasUnicas] = useState([]);

  useEffect(() => {
    if (!usuarioLogado || usuarioLogado.tipo !== 'admin') {
      alert("Acesso negado: apenas administradores.");
      navigate('/app/home');
    }
  }, []);

  // Buscar todas lojas únicas do JSON
  useEffect(() => {
    if (caixasData) {
      const lojas = [...new Set(caixasData.map(item => item.loja))];
      setLojasUnicas(lojas);
    }
  }, [caixasData]);

  // Executar busca no json-server com filtros
  const aplicarFiltros = async () => {
  let query = [];

  if (filtroData) query.push(`data=${filtroData}`);
  if (filtroLoja) query.push(`loja=${filtroLoja}`);
  if (filtroSetor) query.push(`setor=${filtroSetor}`);

  const queryString = query.length > 0 ? `?${query.join("&")}` : "";
  const res = await fetch(`${urlFechamentos}${queryString}`);
  const data = await res.json();

  setFechamentosFiltrados(data);
};

useEffect(() => {
  aplicarFiltros(); // carrega todos sem filtro inicialmente
}, []);

  return (
    <div className="containerHistorico">
      <h1>Histórico de Fechamentos</h1>

      {/* Filtros }
      <div className="filtros">
        <label>
          Data:
          <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />
        </label>
        <label>
          Loja:
          <select value={filtroLoja} onChange={(e) => setFiltroLoja(e.target.value)}>
            <option value="">Todas</option>
            {lojasUnicas.map((loja, index) => (
              <option key={index} value={loja}>{loja}</option>
            ))}
          </select>
        </label>
        <label>
          Setor:
          <input type="text" value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)} />
        </label>
        <button onClick={aplicarFiltros}>Filtrar</button>
      </div>

      {/* Tabela }
      {!fechamentosFiltrados || fechamentosFiltrados.length === 0 ? (
        <p>Nenhum fechamento encontrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Usuário</th>
              <th>Loja</th>
              <th>Setor</th>
              <th>Total Entrada</th>
              <th>Despesas</th>
              <th>Cartões</th>
              <th>Valor Final</th>
            </tr>
          </thead>
          <tbody>
            {fechamentosFiltrados.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.data).toLocaleDateString()}</td>
                <td>{item.usuario}</td>
                <td>{item.loja || '-'}</td>
                <td>{item.setor || '-'}</td>
                <td>R$ {Number(item.totalEntrada || 0).toFixed(2)}</td>
                <td>R$ {Number(item.despesas || 0).toFixed(2)}</td>
                <td>R$ {Number(item.cartoes || 0).toFixed(2)}</td>
                <td>R$ {Number(item.fechamentoFinal || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HistoricoFechamentos;
*/