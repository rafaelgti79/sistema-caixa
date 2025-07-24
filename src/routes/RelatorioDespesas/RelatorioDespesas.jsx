// src/pages/ResultadoFechamento.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../constants/api.js';
import './resultadofechamento.css'; // <-- certifique-se que esse CSS exista

function RelatorioDespesas() {
  const [searchParams] = useSearchParams();
  const dataInicial = searchParams.get('dataInicial');
  const dataFinal = searchParams.get('dataFinal');
  const loja = searchParams.get('loja');

  const [despesas, setDespesas] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function buscarDespesas() {
      try {
        const res = await api.get('/despesas');
        const filtradas = res.data.filter((d) => {
          const dataDespesa = new Date(d.data);
          return (
            dataDespesa >= new Date(dataInicial) &&
            dataDespesa <= new Date(dataFinal) &&
            d.loja?.toLowerCase() === loja?.toLowerCase()
          );
        });
        setDespesas(filtradas);
        const soma = filtradas.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
        setTotal(soma);
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    }

    if (dataInicial && dataFinal && loja) buscarDespesas();
  }, [dataInicial, dataFinal, loja]);

  return (
    <div className="containerDespesas">
      <h2>Despesas em {loja} de {dataInicial} até {dataFinal}</h2>

      {despesas.length === 0 ? (
        <p>Nenhuma despesa encontrada.</p>
      ) : (
        <ul>
          {despesas.map((despesa) => (
            <li key={despesa.id}>
              <strong>{despesa.descricao}</strong> - R$ {parseFloat(despesa.valor).toFixed(2)} ({despesa.categoria}) - ({despesa.usuario})
            </li>
          ))}
        </ul>
      )}

      <p><strong>Total:</strong> R$ {total.toFixed(2)}</p>
      <Link className="BotaoVoltar" to="/app/relatoriomaindespesas">Voltar</Link>
    </div>
  );
}

export default RelatorioDespesas;
