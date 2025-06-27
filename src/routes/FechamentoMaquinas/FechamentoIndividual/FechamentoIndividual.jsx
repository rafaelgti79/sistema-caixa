import React, { useState, useEffect } from 'react';
import api from '../../../constants/api.js';
import './FechamentoIndividual.css';

function FechamentoIndividual() {
  const [maquinas, setMaquinas] = useState([]);
  const [caixas, setCaixas] = useState([]);
  const [fechadas, setFechadas] = useState([]);
  const [inputs, setInputs] = useState({});
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    async function fetchData() {
      try {
        const [maquinasRes, caixasRes] = await Promise.all([
          api.get('/maquinas?fechada=false'),
          api.get('/caixa'),
        ]);
        setMaquinas(maquinasRes.data);
        setCaixas(caixasRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (maquinaId, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [maquinaId]: {
        ...prev[maquinaId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event, maquina) => {
    event.preventDefault();

    const entradaFinal = parseFloat(inputs[maquina.id]?.entradaFinal || 0); // novo
    const saidaFinal = parseFloat(inputs[maquina.id]?.saidaFinal || 0);
    const valorJogo = parseFloat(maquina.valorJogo || 0);

    if (isNaN(entradaFinal) || isNaN(saidaFinal) || isNaN(valorJogo)) {
      alert('Preencha corretamente os valores.');
      return;
    }

    const resultado = (saidaFinal - entradaFinal) * valorJogo;

    const fechamento = {
      maquinaId: maquina.id,
      maquina: maquina.numeroMaquina || maquina.jogo,
      saidaInicial: entradaFinal,
      saidaFinal: saidaFinal,
      resultado: resultado.toFixed(2),
      usuario: usuarioLogado.nome,
      usuarioId: usuarioLogado.id || null,
      dataHora: new Date().toISOString(),
    };

    try {
      await api.put(`/maquinas/${maquina.id}`, { fechada: true });
      setMaquinas(prev => prev.filter(m => m.id !== maquina.id));

      const dataHoje = new Date().toISOString().split('T')[0];
      const caixaAtual = caixas.find(
        (c) =>
          c.usuario === usuarioLogado.nome &&
          c.loja === maquina.loja &&
          c.data === dataHoje
      );

      if (caixaAtual) {
        const novoFechamento = parseFloat(caixaAtual.fechamento || 0) + resultado;
        const novaEntrada = parseFloat(caixaAtual.totalEntrada || 0) + resultado;

        await api.put(`/caixa/${caixaAtual.id}`, {
          ...caixaAtual,
          fechamento: novoFechamento,
          totalEntrada: novaEntrada,
        });
      }

      setFechadas((prev) => [...prev, maquina.id]);

      setInputs((prev) => {
        const updated = { ...prev };
        delete updated[maquina.id];
        return updated;
      });

    } catch (error) {
      console.error('Erro ao salvar fechamento:', error);
    }
  };

  const maquinasAbertas = maquinas.filter((m) => !fechadas.includes(m.id));

  return (
    <div className="containerGrid">
      {maquinasAbertas.length === 0 ? (
        <h2>Todas as máquinas foram fechadas.</h2>
      ) : (
        maquinasAbertas.map((maquina) => {
          const entradaFinal = parseFloat(inputs[maquina.id]?.entradaFinal || 0);
          const saidaFinal = parseFloat(inputs[maquina.id]?.saidaFinal || 0);
          const valorJogo = parseFloat(maquina.valorJogo || 0);
          const resultado = (!isNaN(entradaFinal) && !isNaN(saidaFinal) && !isNaN(valorJogo))
            ? ((saidaFinal - entradaFinal) * valorJogo).toFixed(2)
            : '';

          return (
            <div key={maquina.id} className="maquina-card">
              <h3>Nº: {maquina.numeroMaquina || maquina.jogo}</h3>

              <form onSubmit={(e) => handleSubmit(e, maquina)}>

                <div className="form-row">
                  <label>E.F:</label>
                  <input
                    type="text"
                    value={inputs[maquina.id]?.entradaFinal || ''}
                    onChange={(e) =>
                      handleInputChange(maquina.id, 'entradaFinal', e.target.value)
                    }
                  />
                </div>

                <div className="form-row">
                  <label>S.F:</label>
                  <input
                    type="text"
                    value={inputs[maquina.id]?.saidaFinal || ''}
                    onChange={(e) =>
                      handleInputChange(maquina.id, 'saidaFinal', e.target.value)
                    }
                  />
                </div>

                <div className="form-row">
                  <label>Resultado:</label>
                  <input type="text" value={resultado} readOnly />
                </div>

                <button type="submit">Fechar</button>
              </form>
            </div>
          );
        })
      )}
    </div>
  );
}

export default FechamentoIndividual;
