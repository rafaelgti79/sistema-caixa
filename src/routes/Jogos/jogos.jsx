import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { Link } from 'react-router-dom';

const url = "http://localhost:3000/jogos";

function Jogos() {
  
  const [nomedojogo, setNomeJogo] = useState('');
  const [valorJogo, setValorJogo] = useState('');

  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

   const jogos = {
      nomedojogo,
      valorJogo,
    };
    
    httpConfig(jogos, "POST");
  };

  return (
    <div className="container">
      <h1>Cadastro de Jogos</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>NOME DO JOGO:</label>
            <input type="text" value={nomedojogo} onChange={(event) => setNomeJogo(event.target.value)} />

           <label>Valor do Jogo:</label>
<select value={valorJogo} onChange={(event) => setValorJogo(event.target.value)}>
  <option value="">Selecione o valor</option>
  <option value="0.25">0.25</option>
  <option value="0.05">0.05</option>
  <option value="0.01">0.01</option>
</select>
          </div>
            
          
        </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link className="BotaoVoltar" to="/cadastros">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
export default Jogos;

        
