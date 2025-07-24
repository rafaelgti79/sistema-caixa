import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../constants/api';
import './RelatorioMaquinas.css';

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function truncarDuasCasas(valor) {
  return Math.trunc(valor * 100) / 100;
}

export default function RelatorioMaquinas() {
  const [searchParams] = useSearchParams();
  const lojaFiltro = searchParams.get('loja');
  const dataInicial = searchParams.get('dataInicial');
  const dataFinal = searchParams.get('dataFinal');
  const numeroFiltro = searchParams.get('numero');

  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        const [resFechar, resMaquinas] = await Promise.all([
          api.get('/fecharmaquinas', { params: { fechado: 1 } }),
          api.get('/maquinas'),
        ]);

        const dadosMesclados = resFechar.data.map((f) => {
          const mInfo = resMaquinas.data.find(
            (m) => m.id === f.maquinaId || m.numeroMaquina === f.maquina
          ) || {};

          return {
            ...f,
            numero: mInfo.numeroMaquina || 'N/A',
            loja: mInfo.loja || '',
            jogo: mInfo.jogo || 'Desconhecido',
            valorJogo: parseFloat(mInfo.valor || 0),
            setor: mInfo.setor || '',
            usuario: f.usuario || '',
          };
        });

        console.log('🔎 Dados mesclados:', dadosMesclados);

        const dadosFiltrados = dadosMesclados.filter((m) => {
  const dtHora = new Date(m.dataHora);
  const dtInicio = dataInicial ? new Date(`${dataInicial}T00:00:00.000Z`) : null;
  const dtFim = dataFinal ? new Date(`${dataFinal}T23:59:59.999Z`) : null;

  const okData = (!dtInicio || dtHora >= dtInicio) && (!dtFim || dtHora <= dtFim);
  const okLoja = !lojaFiltro || m.loja?.toLowerCase() === lojaFiltro.toLowerCase();
  const okNumero = !numeroFiltro || String(m.numero) === String(numeroFiltro);

  console.log(`[FILTRO]`, {
    dataHora: m.dataHora,
    dtHora,
    dtInicio,
    dtFim,
    loja: m.loja,
    numero: m.numero,
    okData,
    okLoja,
    okNumero,
  });

  return okData && okLoja && okNumero;
});

         

        console.log('✅ Dados filtrados:', dadosFiltrados);

        setRelatorio(dadosFiltrados);
      } catch (error) {
        console.error('❌ Erro ao buscar relatório:', error);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, [lojaFiltro, dataInicial, dataFinal, numeroFiltro]);

  if (carregando) return <p>Carregando relatório...</p>;
  if (!relatorio.length) return <p>Nenhuma máquina encontrada com os filtros aplicados.</p>;

  const dadosFormatados = relatorio.map((m) => {
    const entradaInicial = parseInt(m.entradaInicial || 0);
    const entradaFinal = parseInt(m.entradaFinal || 0);
    const saidaInicial = parseInt(m.saidaInicial || 0);
    const saidaFinal = parseInt(m.saidaFinal || 0);
    const valorJogo = parseFloat(m.valorJogo || 0);

    const difEntrada = (entradaFinal - entradaInicial) * valorJogo;
    const difSaida = (saidaFinal - saidaInicial) * valorJogo;
    const valorEntrada = difEntrada;
    const valorSaida = parseFloat(m.valorSaida || 0);
    const resultado = parseFloat(m.resultado || 0);
    const rentabilidade =
      valorEntrada !== 0
        ? truncarDuasCasas((resultado / valorEntrada) * 100).toFixed(2)
        : '0.00';

    return {
      ...m,
      entradaInicial,
      entradaFinal,
      saidaInicial,
      saidaFinal,
      difEntrada,
      difSaida,
      valorEntrada,
      valorSaida,
      resultado,
      rentabilidade,
    };
  });

  return (
    <div className="relatorio-container">
      <h3>Relatório por Máquina</h3>
      <table>
        <thead>
          <tr>
            <th>Nº</th>
            <th>JOGO</th>
            <th>VALOR</th>
            <th>TOTAL DE ENTRADAS</th> {/* coluna única com as 3 infos */}
            <th>DIF. E.</th>
            <th>TOTAL DE ENTRADAS</th>
            <th>DIF. S.</th>
            
            <th>RES.</th>
            <th>DIF. T.</th>
            <th>RET.</th>
            <th>DATA</th>
            <th>LOJA</th>
            <th>USUÁRIO</th>
          </tr>
        </thead>

        <tbody>
          {dadosFormatados.map((m, index) => (
            <tr key={index}>
              <td>{m.numero}</td>
              <td>{m.jogo}</td>
              <td>{formatarMoeda(m.valorJogo)}</td>

              {/* junta as 3 informações na mesma célula */}
              <td>
                {m.entradaInicial} {' '}
                {m.entradaFinal} {' '}
                {formatarMoeda(m.difEntrada)}
              </td>

              <td>{0}</td>

              <td>
              {m.saidaInicial} {' '}
              {m.saidaFinal} {' '}
              {formatarMoeda(m.difSaida)}
              </td>

              <td>{formatarMoeda(m.valorSaida)}</td>
              <td>{formatarMoeda(m.resultado)}</td>
              <td>{0}</td>
              <td>{m.rentabilidade}%</td>
              <td>{formatarData(m.dataHora)}</td>
              <td>{m.loja}</td>
              <td>{m.usuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


