import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/reforco";


function Reforco() {
  
  const [valor, setValor] = useState('');
  
  const {data: items, httpConfig} = useFetch(url);
  

  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Adicionar data atual altomatico
    const dataHoje = new Date().toISOString().split('T')[0];

    
    const cartao = {

      valor,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };
    httpConfig(cartao, "POST");
    
    // Limpar os campos
    setValor('');
   
  

  };

  return (
    <div className="containerDespesas">
      <h1>REFORÇO</h1>
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
export default Reforco;
            
          
       

        
