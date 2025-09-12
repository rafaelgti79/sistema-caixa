import React, { useEffect, useState } from 'react';
import api from '../../constants/api.js';


function ResumoTotal() {
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

  const formatBRL = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="containerDespesas">
      <h2>Resumo Total</h2>

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
          <p><strong>Entradas:</strong> {formatBRL(resumo.totalEntradas)}</p>
          <p><strong>Saídas:</strong> R$ {formatBRL(resumo.totalSaidas)}</p>
          <p><strong>Bruto:</strong> R$ {formatBRL(resumo.bruto)}</p>
          <p><strong>Despesas:</strong> R$ {formatBRL(resumo.despesas)}</p>
          <p><strong>Liquido:</strong> R$ {formatBRL(resumo.liquido)}</p>
        </div>
      )}
    
         
    </div>
  );
}

export default ResumoTotal;

    
