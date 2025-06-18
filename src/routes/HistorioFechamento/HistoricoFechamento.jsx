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

      {/* Filtros */}
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

      {/* Tabela */}
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
