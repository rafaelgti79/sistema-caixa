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
  const [cartoes, setCartoes] = useState([]);


  useEffect(() => {
  async function fetchCartoes() {
    try {
      const res = await api.get('/cartao');
      setCartoes(res.data);
    } catch (err) {
      console.error('Erro ao buscar dados de cartão:', err);
    }
  }
  fetchCartoes();
}, []);

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
          <p><strong>Entradas:</strong> {formatBRL(resumo.totalEntradas)}</p>

          <p><strong>Saídas:</strong> R$ {formatBRL(resumo.totalSaidas)}</p>
          <p><strong>Bruto:</strong> R$ {formatBRL(resumo.bruto)}</p>
          <p><strong>Despesas:</strong> R$ {formatBRL(resumo.despesas)}</p>
          <p><strong>Liquido:</strong> R$ {formatBRL(resumo.liquido)}</p>
          {/* <p><strong>Fundo Inicial:</strong> R$ {formatBRL(resumo.fundoInicial)}</p> */}
          <p><strong>Reforço:</strong> R$ {formatBRL(resumo.reforco)}</p>
          <p><strong>Composição Total:</strong> R$ {formatBRL(resumo.composicao)}</p>
          <p><strong>Cartão:</strong> R$ {formatBRL(resumo.cartao)}</p>
          <p><strong>Dinheiro:</strong> R$ {formatBRL(resumo.dinheiro)}</p>
          <p><strong>Sangria:</strong> R$ {formatBRL(resumo.sangria)}</p>
          <p><strong>Sobra:</strong> R$ {formatBRL(resumo.sobra)}</p>
          <p><strong>Falta:</strong> R$ {formatBRL(resumo.falta)}</p>
        </div>
      )}

      <ul className="grid-list">
  {historicoFiltrado.map((item, idx) => {
         const dataItem = item.data.slice(0, 10);
  const usuarioItem = item.usuario?.trim().toLowerCase();

  const cartoesFiltrados = cartoes.filter(c =>
    c.data?.slice(0, 10) === dataItem &&
    c.usuario?.trim().toLowerCase() === usuarioItem
  );
  console.log('--- Comparando ---');
console.log('Data:', dataItem);
console.log('Usuário:', usuarioItem);
console.log('Cartões encontrados:', cartoesFiltrados);

  const totaisPorTipo = { credito: 0, debito: 0, pix: 0 };

  cartoesFiltrados.forEach(c => {
    const tipo = c.tipo?.toLowerCase();
    const valor = Number(c.valor || 0); // << aqui corrigido

    if (tipo === 'credito') totaisPorTipo.credito += valor;
    if (tipo === 'debito') totaisPorTipo.debito += valor;
    if (tipo === 'pix') totaisPorTipo.pix += valor;
  });


    return (
      <li key={idx} className="grid-item">
        <div className="grid-row"><span className="label">Data:</span><span className="value">{item.data}</span></div>
        <div className="grid-row"><span className="label">Usuário:</span><span className="value">{item.usuario}</span></div>
        <div className="grid-row"><span className="label">Total Entrada:</span><span className="value">R$ {formatBRL(item.totalSomaEntradas)}</span></div>
        <div className="grid-row"><span className="label">Total de Saída:</span><span className="value">R$ {formatBRL(item.totalSomaSaidas)}</span></div>
        <div className="grid-row linha-bruto"><span className="label">Resultado Bruto:</span><span className="value">R$ {formatBRL(item.bruto)}</span></div>
        <div className="grid-row"><span className="label">Despesas:</span><span className="value">R$ {formatBRL(item.despesas)}</span></div>
        <div className="grid-row"><span className="label">Resultado Líquido:</span><span className="value">R$ {formatBRL(item.liquido)}</span></div>
        <div className="grid-row"><span className="label">Fundo Inicial:</span><span className="value">R$ {formatBRL(item.fundoInicial)}</span></div>
        <div className="grid-row"><span className="label">Reforço:</span><span className="value">R$ {formatBRL(item.reforca)}</span></div>
        <div className="grid-row"><span className="label">Composição Total:</span><span className="value">R$ {formatBRL(item.composicaoTotal)}</span></div>

        {/* 🔄 Cartão total geral (se ainda quiser manter) */}
        {/* <div className="grid-row"><span className="label">Cartão:</span><span className="value">R$ {formatBRL(item.cartao)}</span></div> */}

        {/* ✅ Novos campos filtrados da rota /cartao */}
        <div className="grid-row"><span className="label">Cartão Crédito:</span><span className="value">R$ {formatBRL(item.cartaoCredito)}</span></div>
        <div className="grid-row"><span className="label">Cartão Débito:</span><span className="value">R$ {formatBRL(item.cartaoDebito)}</span></div>
        <div className="grid-row"><span className="label">Pix:</span><span className="value">R$ {formatBRL(item.cartaoPix)}</span></div>

        <div className="grid-row"><span className="label">Dinheiro:</span><span className="value">R$ {formatBRL(item.dinheiro)}</span></div>
        <div className="grid-row"><span className="label">Sangria:</span><span className="value">R$ {formatBRL(item.sangria)}</span></div>
        <div className="grid-row"><span className="label">Sobra:</span><span className="value">R$ {formatBRL(item.sobra)}</span></div>
        <div className="grid-row"><span className="label">Falta:</span><span className="value">R$ {formatBRL(item.falta)}</span></div>
      </li>
    );
  })}
</ul>

    </div>
  );
}

export default HistoricoCaixa;
