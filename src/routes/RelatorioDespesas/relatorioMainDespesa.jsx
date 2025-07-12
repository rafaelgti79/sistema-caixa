// src/pages/FiltroFechamento.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../constants/api.js';


function RelatorioMainDespesas() {
  const [data, setData] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState('');
  const [lojas, setLojas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarLojas() {
      try {
        const res = await api.get('/lojas');
        setLojas(res.data);
      } catch (error) {
        console.error('Erro ao buscar lojas:', error);
      }
    }

    carregarLojas();
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!data || !lojaSelecionada) {
      alert('Selecione a data e a loja.');
      return;
    }
    navigate(`/app/relatoriodespesas?data=${data}&loja=${encodeURIComponent(lojaSelecionada)}`);
  };

  return (
    <div className="containerDespesas">
      <h1>Buscar Despesas</h1>
      <form onSubmit={handleBuscar}>
        <label>Data:</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} />

        <label>Loja:</label>
        <select value={lojaSelecionada} onChange={(e) => setLojaSelecionada(e.target.value)}>
          <option value="">Selecione uma loja</option>
          {lojas.map((loja) => (
            <option key={loja.id || loja.loja} value={loja.loja}>{loja.loja}</option>
          ))}
        </select>

        <button type="submit">Buscar</button>
        <Link className="BotaoVoltar" to="/app/relatorios">Voltar</Link>
      </form>
    </div>
  );
}

export default RelatorioMainDespesas;
