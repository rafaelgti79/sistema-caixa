import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';


function Dinheiro() {
  const [valor, setValor] = useState('');
  const [dinheiroUsuario, setDinheiroUsuario] = useState([]);
  const [totalDinheiroAbertas, setTotalDinheiroAbertas] = useState(0);


  //Dinheiro dos usuarios
    useEffect(() => {
    async function carregarDinheiroUsuario() {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const hoje = new Date().toISOString().split('T')[0];
  
      try {
        const res = await api.get('/dinheiro');
        const dinheiroFiltradas = res.data.filter(
          (d) =>
            d.usuario === usuarioLogado.nome &&
            d.data?.startsWith(hoje) &&
            d.fechado === 0
        );
        setDinheiroUsuario(dinheiroFiltradas);
      } catch (err) {
        console.error('Erro ao carregar Dinheiro do usuário:', err);
      }
    }
  
    carregarDinheiroUsuario();
  }, []);
  
  
  //Deletar as Dinheiro
  const deletarDinheiro = async (id) => {
    try {
      await api.delete(`/dinheiro/${id}`);
      setDinheiroUsuario(dinheiroUsuario.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar Dinheiro:', err);
    }
  };
  
  //Total dos Dinheiro
  useEffect(() => {
    const total = dinheiroUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
    setTotalDinheiroAbertas(total);
  }, [dinheiroUsuario]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!valor.trim()) {
      alert("Informe o valor.");
      return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const dataHoje = new Date().toISOString().split('T')[0];
    const dinheiro = {
      valor: parseFloat(valor),
      usuario: usuarioLogado.nome,
      data: dataHoje
      
    };

  try 
    {
      await api.post('/dinheiro', dinheiro);
      setValor('');
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    }
  };

  return (
    <div className="containerDespesas">
      <h1>DINHEIRO</h1>
      <form onSubmit={handleSubmit}>
        <div className="subcontainer">
          <label>VALOR:</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />
        </div>

        

        <div className="lista-despesas">
                <h2>Dinheiro</h2>
                {dinheiroUsuario.length === 0 ? (
                  <p></p>
                ) : (
                  <ul>
                    {dinheiroUsuario.map((dinheiro) => (
                      <li key={dinheiro.id}>
                        <strong>{dinheiro.id}</strong> - R$ {parseFloat(dinheiro.valor).toFixed(2)}
                        <button
                          style={{ marginLeft: '10px', color: 'red' }}
                          onClick={() => deletarDinheiro(dinheiro.id)}
                        >
                          Excluir
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p><strong>Total:</strong> R$ {totalDinheiroAbertas.toFixed(2)}</p>
                <div className="botao-salvar">
                        <button type="submit">Salvar</button>
                        <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
                      </div>
              </div>
      </form>
    </div>
  );
}

export default Dinheiro;





/*
import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/dinheiro";


function Dinheiro() {
  
  const [valor, setValor] = useState('');
  const {data: items, httpConfig} = useFetch(url);
  

  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    const dinheiro = {

       valor: parseFloat(valor),
       usuario: usuarioLogado.nome
    };
    httpConfig(dinheiro, "POST");
    
    // Limpar os campos
    setValor('');
  

  };

  return (
    <div className="containerDespesas">
      <h1>DINHEIRO</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
           
           <label>VALOR:</label>
            <input
  type="number"
  step="0.01"
  value={valor}
  onChange={(event) => setValor(event.target.value)}
/>
          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Dinheiro;
            */
          
       

        
