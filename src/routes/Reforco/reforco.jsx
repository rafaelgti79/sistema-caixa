import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js';
import { Link } from 'react-router-dom';
import './reforco.css';

function Reforco() {
  
  const [valor, setValor] = useState('');
  const [reforcoUsuario, setReforcoUsuario] = useState([]);
  const [totalReforcoAbertas, setTotalReforcoAbertas] = useState(0);
  const [caixaAberto, setCaixaAberto] = useState(null);

   
  //Buscar o caixa aberto para vincular 
  useEffect(() => {
  async function buscarCaixaAberto() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    try {
      const res = await api.get('/caixa', {
        params: {
          status: 'aberto',
          usuario: usuarioLogado.nome
        }
      });
      const caixa = res.data[0];
      if (caixa) setCaixaAberto(caixa);
    } catch (error) {
      console.error('Erro ao buscar caixa aberto:', error);
    }
  }
  buscarCaixaAberto();
}, []);



//Reforço dos usuarios
  useEffect(() => {
  async function carregarReforcoUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const hoje = new Date().toISOString().split('T')[0];

    try {
      const res = await api.get('/reforco');
      const reforcoFiltradas = res.data.filter(
        (d) =>
          d.usuario === usuarioLogado.nome &&
          d.data?.startsWith(hoje) &&
          d.fechado === 0
      );
      setReforcoUsuario(reforcoFiltradas);
    } catch (err) {
      console.error('Erro ao carregar despesas do usuário:', err);
    }
  }
  carregarReforcoUsuario();
}, []);



//Deletar as despesas
const deletarReforco = async (id) => {
  try {
    await api.delete(`/reforco/${id}`);
    setReforcoUsuario(reforcoUsuario.filter((d) => d.id !== id));
  } catch (err) {
    console.error('Erro ao deletar Reforço:', err);
  }
};

//Total dos Reforço
useEffect(() => {
  const total = reforcoUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
  setTotalReforcoAbertas(total);
}, [reforcoUsuario]);

   const handleSubmit = async (event) => {
     event.preventDefault();

  if (!caixaAberto) {
    alert('Nenhum caixa aberto encontrado.');
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const dataHoje = new Date().toISOString().split('T')[0];

  const reforco = {
    valor,
    usuario: usuarioLogado.nome,
    data: dataHoje,
    caixaId: caixaAberto.id // ✅ agora com vínculo ao caixa
  };

  try {
    await api.post('/reforco', reforco);
    setValor('');
    
    // Atualiza lista após salvar
    const res = await api.get('/reforco');
    const reforcoFiltradas = res.data.filter(
      (d) =>
        d.usuario === usuarioLogado.nome &&
        d.caixaId === caixaAberto.id &&
        d.fechado === 0
    );
    setReforcoUsuario(reforcoFiltradas);

  } catch (error) {
    console.error('Erro ao salvar reforço:', error);
  }
};

  return (
    <div className="containerCastroReforco">
      <h1>REFORÇO</h1>
      <form onSubmit={handleSubmit}>
          
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />
          
    

      <div className="lista-Reforco">
        
        {reforcoUsuario.length === 0 ? (
          <p></p>
        ) : (
          <ul>
            {reforcoUsuario.map((reforco) => (
              <li key={reforco.id}>
                <strong>{reforco.id}</strong> - R$ {parseFloat(reforco.valor).toFixed(2)}
                <button
                  style={{ marginLeft: '10px', color: 'white' }}
                  onClick={() => deletarReforco(reforco.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
        <p><strong>Total:</strong> R$ {totalReforcoAbertas.toFixed(2)}</p>

        <div className="btn-abrirReforco">
          <button className='btn-salvarReforco' type="submit">Salvar</button>
          <Link className="btn-voltarReforco" to="/app/home-caixa">Voltar</Link>
       </div>

      </div>
      </form>
    </div>
  );
}
export default Reforco;
           
            

        
            
          
       

        
