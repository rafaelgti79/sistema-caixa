// src/pages/HistoricoCaixa.jsx
import React, { useEffect, useState } from 'react';
import api from '../../constants/api.js'; // verifique o caminho conforme estrutura
import './HistorioFechamento.css';

function HistoricoCaixa() {
  const [historico, setHistorico] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);

  // 🔄 Buscar histórico ao montar
  useEffect(() => {
    async function fetchHistorico() {
      try {
        const res = await api.get('/historicocaixa');
        setHistorico(res.data);
      } catch (err) {
        console.error('Erro ao buscar histórico:', err);
      }
    }
    fetchHistorico();
  }, []);

  // ⚙️ Filtrar quando histórico ou filtros mudarem
  useEffect(() => {
    const filtrado = historico.filter(item =>
      (filtroUsuario === '' || item.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())) &&
      (filtroData === '' || item.data === filtroData)
    );
    setHistoricoFiltrado(filtrado);
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


