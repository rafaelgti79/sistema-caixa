import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';
import './Dinheiro.css';

function Dinheiro() {
  const [valor, setValor] = useState('');
  const [dinheiroUsuario, setDinheiroUsuario] = useState([]);
  const [totalDinheiroAbertas, setTotalDinheiroAbertas] = useState(0);
  const [caixaAberto, setCaixaAberto] = useState(null);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // 🔹 Buscar o caixa aberto do usuário
  useEffect(() => {
    async function buscarCaixaAberto() {
      try {
        const res = await api.get('/caixa', {
          params: {
            status: 'aberto',
            usuario: usuarioLogado.nome
          }
        });
        const caixa = res.data[0];
        if (caixa) setCaixaAberto(caixa);
      } catch (err) {
        console.error('Erro ao buscar caixa aberto:', err);
      }
    }

    buscarCaixaAberto();
  }, [usuarioLogado.nome]);

  // 🔹 Função reutilizável para carregar os dados de dinheiro
  const carregarDinheiroUsuario = async () => {
    if (!caixaAberto) return;

    try {
      const res = await api.get('/dinheiro', {
        params: { caixaId: caixaAberto.id }
      });
      const dinheiroFiltradas = res.data.filter((d) => d.fechado === 0);
      setDinheiroUsuario(dinheiroFiltradas);
    } catch (err) {
      console.error('Erro ao carregar Dinheiro do usuário:', err);
    }
  };

  // 🔹 Carregar quando caixaAberto estiver disponível
  useEffect(() => {
    carregarDinheiroUsuario();
  }, [caixaAberto]);

  // 🔹 Calcular total
  useEffect(() => {
    const total = dinheiroUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
    setTotalDinheiroAbertas(total);
  }, [dinheiroUsuario]);

  // 🔹 Deletar registro de dinheiro
  const deletarDinheiro = async (id) => {
    try {
      await api.delete(`/dinheiro/${id}`);
      setDinheiroUsuario(dinheiroUsuario.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar Dinheiro:', err);
    }
  };

  // 🔹 Submeter novo valor em dinheiro
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!valor.trim()) {
      alert("Informe o valor.");
      return;
    }

    if (!usuarioLogado || !usuarioLogado.nome) {
      alert("Usuário não autenticado.");
      return;
    }

    if (!caixaAberto) {
      alert("Nenhum caixa aberto encontrado.");
      return;
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    const dinheiro = {
      valor: parseFloat(valor),
      usuario: usuarioLogado.nome,
      data: dataHoje,
      caixaId: caixaAberto.id // 🔸 Relaciona com caixa
    };

    try {
      await api.post('/dinheiro', dinheiro);
      setValor('');
      await carregarDinheiroUsuario(); // ✅ Recarrega após salvar
    } catch (error) {
      console.error('Erro ao salvar dinheiro:', error);
    }
  };

  return (
    <div className="containerCastroDinheiro">
      <h1>DINHEIRO</h1>
      <form onSubmit={handleSubmit}>
        
          <label>VALOR:</label>
          <input className='inpuCaixaDinheiro'
            type="number"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />
            
               

        <div className="lista-Dinheiro">
                <h2>Dinheiro</h2>
                {dinheiroUsuario.length === 0 ? (
                  <p></p>
                ) : (
                  <ul>
                    {dinheiroUsuario.map((dinheiro) => (
                      <li key={dinheiro.id}>
                        <strong>{dinheiro.id}</strong> - R$ {parseFloat(dinheiro.valor).toFixed(2)}
                        <button
                          style={{ marginLeft: '10px', color: 'white' }}
                          onClick={() => deletarDinheiro(dinheiro.id)}
                        >
                          Excluir
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p><strong>Total:</strong> R$ {totalDinheiroAbertas.toFixed(2)}</p>
                <div className="btn-abrirDinheiro">
                  <button className='btn-salvarDinheiro' type="submit">Salvar</button>
                  <Link className="btn-voltarDinheiro" to="/app/home-caixa">Voltar</Link>
                </div>
              </div>
      </form>
    </div>
  );
}

export default Dinheiro;


