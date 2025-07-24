import React, { useEffect, useState } from 'react';
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


function RelatorioMaquinas() {
  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        const [resFechar, resMaquinas] = await Promise.all([
          api.get('/fecharmaquinas', { params: { fechado: 1 } }),
          api.get('/maquinas'),
        ]);

        const dados = resFechar.data.map((fechamento) => {
          const maquinaInfo = resMaquinas.data.find(
            (m) =>
              m.numeroMaquina === fechamento.maquina ||
              m.id === fechamento.maquinaId
          );

          return {
            ...fechamento,
            numero: maquinaInfo?.numeroMaquina || 'N/A',
            jogo: maquinaInfo?.jogo || 'Desconhecido',
            valorJogo: maquinaInfo?.valor || 0,
            setor: maquinaInfo?.setor || '',
            loja: maquinaInfo?.loja || '',
            inicial: maquinaInfo?.inicial || 0,  // puxando o 'inicial' da máquina aqui
            final: maquinaInfo?.final || 0,  // puxando o 'inicial' da máquina aqui
          };
        });

        setRelatorio(dados);
      } catch (error) {
        console.error('Erro ao buscar relatório:', error);
      } finally {
        setCarregando(false);
      }
    }

    buscarDados();
  }, []);

  function truncarDuasCasas(valor) {
  return Math.trunc(valor * 100) / 100;
}

  if (carregando) return <p>Carregando relatório...</p>;
  if (!relatorio.length) return <p>Nenhuma máquina fechada encontrada.</p>;

  const dadosFormatados = relatorio.map((m) => {
    const entradaInicial = parseInt(m.entradaInicial || 0);      // usa 'inicial' da máquina
    const entradaFinal = parseInt(m.entradaFinal || 0);
    const saidaInicial = parseInt(m.saidaInicial || 0); // ✔️

    const saidaFinal = parseInt(m.saidaFinal || 0);
    const valorJogo = parseFloat(m.valorJogo || 0);

    

    const difEntrada = (entradaFinal - entradaInicial) * valorJogo ;
    const difSaida = (saidaFinal - saidaInicial)  * valorJogo;

    const valorSaida = parseFloat(m.valorSaida || 0);
    //const resultado = valorEntrada - valorSaida;
    const resultado = parseFloat(m.resultado || 0);
    const difTotal = Math.abs(resultado);
    
    const valorEntrada = difEntrada;

    const rentabilidade =
  valorEntrada !== 0
    ? truncarDuasCasas((resultado / valorEntrada) * 100).toFixed(2)
    : '0.00';

    return {
      numero: m.numero,
      jogo: m.jogo,
      valorJogo: m.valorJogo,
      setor: m.setor,
      loja: m.loja,
      dataHora: m.dataHora,
      usuario: m.usuario,
      entradaInicial,
      entradaFinal,
      difEntrada,
      valorEntrada,
      saidaInicial,
      saidaFinal,
      difSaida,
      valorSaida,
      resultado,
      difTotal,
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

export default RelatorioMaquinas;
