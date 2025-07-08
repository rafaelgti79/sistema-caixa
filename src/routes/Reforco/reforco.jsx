import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js';
import { Link } from 'react-router-dom';


function Reforco() {
  
  const [valor, setValor] = useState('');
  const [reforcoUsuario, setReforcoUsuario] = useState([]);
  const [totalReforcoAbertas, setTotalReforcoAbertas] = useState(0);
   

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

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Adicionar data atual altomatico
    const dataHoje = new Date().toISOString().split('T')[0];

    
    const reforco = {
      valor,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };

     try {
      await api.post('/reforco', reforco);
      setValor('');
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    }
  };

  return (
    <div className="containerDespesas">
      <h1>REFORÇO</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />
          </div>
    

      <div className="lista-despesas">
        <h2>Reforço Abertas</h2>
        {reforcoUsuario.length === 0 ? (
          <p>Nenhuma despesa aberta encontrada.</p>
        ) : (
          <ul>
            {reforcoUsuario.map((reforco) => (
              <li key={reforco.id}>
                <strong>{reforco.id}</strong> - R$ {parseFloat(reforco.valor).toFixed(2)}
                <button
                  style={{ marginLeft: '10px', color: 'red' }}
                  onClick={() => deletarReforco(reforco.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
        <p><strong>Total:</strong> R$ {totalReforcoAbertas.toFixed(2)}</p>
        <div className="botao-salvar">
                <button type="submit">Salvar</button>
                <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
              </div>
      </div>
      </form>
    </div>
  );
}
export default Reforco;
           
            

        
            
          
       

        
