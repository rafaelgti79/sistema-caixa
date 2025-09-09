import React, { useEffect, useState } from 'react';
import api from '../../constants/api.js';
import './HistorioFechamento.css';

function HistoricoCaixa() {
  const [historico, setHistorico] = useState([]);
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [historicoFiltrado, setHistoricoFiltrado] = useState([]);
  const [resumo, setResumo] = useState(null);

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

  useEffect(() => {
    const filtrado = historico.filter(item => {
      const dataItem = new Date(item.data);
      const inicio = dataInicial ? new Date(dataInicial) : null;
      const fim = dataFinal ? new Date(dataFinal) : null;

      const dentroIntervalo =
        (!inicio || dataItem >= inicio) &&
        (!fim || dataItem <= fim);

      const usuarioCorresponde =
        filtroUsuario === '' || item.usuario.toLowerCase().includes(filtroUsuario.toLowerCase());

      return dentroIntervalo && usuarioCorresponde;
    });

    setHistoricoFiltrado(filtrado);

    // Calcular resumo
    const total = filtrado.reduce(
      (acc, item) => {
        acc.totalEntradas += Number(item.totalSomaEntradas || 0);
        acc.totalSaidas += Number(item.totalSomaSaidas || 0);
        acc.bruto += Number(item.bruto || 0);
        acc.despesas += Number(item.despesas || 0);
        acc.liquido += Number(item.liquido || 0);
        acc.fundoInicial += Number(item.fundoInicial || 0);
        acc.reforco += Number(item.reforco || 0);
        acc.composicao += Number(item.composicaoTotal || item.composicao || 0);
        acc.cartao += Number(item.cartao || 0);
        acc.dinheiro += Number(item.dinheiro || 0);
        acc.sangria += Number(item.sangria || 0);
        acc.sobra += Number(item.sobra || 0);
        acc.falta += Number(item.falta || 0);
        return acc;
      },
      {
        totalEntradas: 0,
        totalSaidas: 0,
        bruto: 0,
        despesas: 0,
        liquido: 0,
        fundoInicial: 0,
        reforco: 0,
        composicao: 0,
        cartao: 0,
        dinheiro: 0,
        sangria: 0,
        sobra: 0,
        falta: 0,
      }
    );

    setResumo(total);
  }, [historico, dataInicial, dataFinal, filtroUsuario]);

  return (
    <div className="containerDespesas">
      <h2>Histórico de Fechamentos</h2>

      <div className="filtros">
        
        <input
          type="date"
          value={dataInicial}
          onChange={e => setDataInicial(e.target.value)}
        />
        <input
          type="date"
          value={dataFinal}
          onChange={e => setDataFinal(e.target.value)}
        />
      </div>

      {/* 🔢 Resumo Totalizador */}
      {resumo && (
        <div className="resumo-total">
          <h3>Resumo do Período</h3>
          <p><strong>Entradas:</strong> R$ {resumo.totalEntradas.toFixed(2)}</p>
          <p><strong>Saídas:</strong> R$ {resumo.totalSaidas.toFixed(2)}</p>
          <p><strong>Bruto:</strong> R$ {resumo.bruto.toFixed(2)}</p>
          <p><strong>Despesas:</strong> R$ {resumo.despesas.toFixed(2)}</p>
          <p><strong>Liquido:</strong> R$ {resumo.liquido.toFixed(2)}</p>
          <p><strong>Fundo Inicial:</strong> R$ {resumo.fundoInicial.toFixed(2)}</p>
          <p><strong>Reforço:</strong> R$ {resumo.reforco.toFixed(2)}</p>
          <p><strong>Composição Total:</strong> R$ {resumo.composicao.toFixed(2)}</p>
          <p><strong>Cartão:</strong> R$ {resumo.cartao.toFixed(2)}</p>
          <p><strong>Dinheiro:</strong> R$ {resumo.dinheiro.toFixed(2)}</p>
          <p><strong>Sangria:</strong> R$ {resumo.sangria.toFixed(2)}</p>
          <p><strong>Sobra:</strong> R$ {resumo.sobra.toFixed(2)}</p>
          <p><strong>Falta:</strong> R$ {resumo.falta.toFixed(2)}</p>
        </div>
      )}

      <ul className="grid-list">
        {historicoFiltrado.length > 0 ? (
          historicoFiltrado.map((item, idx) => (
            <li key={idx} className="grid-item">
              <div className="grid-row"><span className="label">Data:</span><span className="value">{item.data}</span></div>
              <div className="grid-row"><span className="label">Usuário:</span><span className="value">{item.usuario}</span></div>
              <div className="grid-row"><span className="label">Total Entrada :</span><span className="value">R$ {Number(item.totalSomaEntradas).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Total de Saida:</span><span className="value">R$ {Number(item.totalSomaSaidas).toFixed(2)}</span></div>
              <div className="grid-row linha-bruto"><span className="label">Resultado Bruto:</span><span className="value">R$ {Number(item.bruto).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Despesas:</span><span className="value">R$ {Number(item.despesas).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Resultado Liquido:</span><span className="value">R$ {Number(item.liquido).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Fundo Inicial:</span><span className="value">R$ {Number(item.fundoInicial).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Reforço:</span><span className="value">R$ {Number(item.reforco || 0).toFixed(2)}</span></div>

              <div className="grid-row"><span className="label">Composição Total:</span><span className="value">R$ {Number(item.composicaoTotal || item.composicao).toFixed(2)}</span></div>
              <div className="grid-row"><span className="label">Cartão:</span><span className="value">R$ {Number(item.cartao || 0).toFixed(2)}</span></div>
              
              <div className="grid-row"><span className="label">Dinheiro:</span><span className="value">R$ {Number(item.dinheiro).toFixed(2)}</span></div>
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
