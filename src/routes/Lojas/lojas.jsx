import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { Link } from 'react-router-dom';

const url = "http://localhost:3000/app/lojas";


function Loja() {
  const [loja, setLoja] = useState('');
 
  const {data: items, httpConfig} = useFetch(url);



  const handleSubmit = (event) => {
    event.preventDefault();

     const lojas = {
      loja,
      
    };
    
    httpConfig(lojas, "POST");
  };

  return (
    <div className="container">
      <h1>Cadastro de Lojas</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>NOME DA LOJA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
          </div>
        </div>
           
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link className="BotaoVoltar" to="/app/cadastros">Voltar</Link>
        </div>
        
      </form>
    </div>
  );
}
export default Loja;
            
          

        
