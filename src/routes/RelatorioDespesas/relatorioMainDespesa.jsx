// src/pages/FiltroFechamento.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../constants/api.js';

function RelatorioMainDespesas() {
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState('MAX');
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

    if (!dataInicial || !dataFinal || !lojaSelecionada) {
      alert('Preencha todas as informações.');
      return;
    }

    navigate(
      `/app/relatoriodespesas?dataInicial=${dataInicial}&dataFinal=${dataFinal}&loja=${encodeURIComponent(lojaSelecionada)}`
    );
  };

  return (
    <div className="containerDespesas">
      <h1>Buscar Despesas</h1>
      <form onSubmit={handleBuscar}>
        <label>Data Inicial:</label>
        <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />

        <label>Data Final:</label>
        <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />

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
