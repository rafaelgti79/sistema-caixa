import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../constants/api.js'; 


function Jogos() {
  
  const [nomedojogo, setNomeJogo] = useState('');
  const [valorJogo, setValorJogo] = useState('');
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nomedojogo.trim() || !valorJogo.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const jogo = {
        nomedojogo,
        valor: parseFloat(valorJogo),
      };

      await api.post("/jogos", jogo);
      alert("Jogo cadastrado com sucesso!");

      // Limpar os campos
      setNomeJogo('');
      setValorJogo('');
    } catch (error) {
      console.error("Erro ao cadastrar jogo:", error);
      alert("Erro ao cadastrar jogo");
    }
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
          <Link className="BotaoVoltar" to="/app/cadastros">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
export default Jogos;

        
