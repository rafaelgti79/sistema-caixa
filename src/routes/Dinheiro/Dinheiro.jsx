import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/dinheiro";

function Dinheiro() {
  const [valor, setValor] = useState('');

  const { data: items, httpConfig } = useFetch(url);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!valor.trim()) {
      alert("Informe o valor.");
      return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    const dinheiro = {
      valor: parseFloat(valor),
      usuario: usuarioLogado.nome,
      dataHora: new Date().toLocaleString('pt-BR', { hour12: false })
    };

    httpConfig(dinheiro, "POST");

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
          
       

        
