// src/pages/FiltroRelatorioMaquinas.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../constants/api.js';
import './FiltroRelatorioMaquinas.css'; // (criaremos esse CSS)

function FiltroRelatorioMaquinas() {
  const [lojas, setLojas] = useState([]);
  const [lojaSelecionada, setLojaSelecionada] = useState('MAX');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [numeroMaquina, setNumeroMaquina] = useState('');
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

    if (!lojaSelecionada || !dataInicial || !dataFinal) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (new Date(dataFinal) < new Date(dataInicial)) {
      alert('A data final deve ser igual ou posterior à data inicial.');
      return;
    }

    const query = new URLSearchParams({
      loja: lojaSelecionada,
      dataInicial,
      dataFinal,
      numero: numeroMaquina || '',
    }).toString();

    navigate(`/app/relatoriomaquinas?${query}`);
  };

  return (
    <div className="filtro-container">
      <h2>Filtrar Relatório de Máquinas</h2>
      <form onSubmit={handleBuscar}>
        <label>Loja:</label>
        <select value={lojaSelecionada} onChange={(e) => setLojaSelecionada(e.target.value)}>
          <option value="">Selecione uma loja</option>
          {lojas.map((loja) => (
            <option key={loja.id} value={loja.loja}>{loja.loja}</option>
          ))}
        </select>

        <label>Data Inicial:</label>
        <input type="date" value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} />

        <label>Data Final:</label>
        <input type="date" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />

        <label>Número da Máquina (opcional):</label>
        <input type="text" value={numeroMaquina} onChange={(e) => setNumeroMaquina(e.target.value)} />

        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}

export default FiltroRelatorioMaquinas;
