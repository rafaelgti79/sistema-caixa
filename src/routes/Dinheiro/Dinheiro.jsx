import React, { useState } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';


function Dinheiro() {
  const [valor, setValor] = useState('');

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

        <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
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
          
       

        
