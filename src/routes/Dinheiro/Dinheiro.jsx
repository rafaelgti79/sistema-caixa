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

      valor,
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
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />

          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Dinheiro;
            
          
       

        
