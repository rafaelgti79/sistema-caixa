import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CozinhaAddProduto() {
  const [loja, setLoja] = useState('');
  const [numeroMaquina, setNumeroMaquina] = useState('');
  const [jogo, setJogo] = useState('');
  const [maquineiro, setMaquineiro] = useState('');
  const [setor, setSetor] = useState('');
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica para salvar as informações
    console.log('Informações salvas:', {
      loja,
      numeroMaquina,
      jogo,
      maquineiro,
      setor,
      entrada,
      saida,
    });
  };

  return (
    <div className="container">
      <h1>CADASTRAR UM PRODUTO</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>NOME DO PRODUTO :</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
           <label>VALOR DO PRODUTO:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>CATEGORIA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>LOJA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
          </div>
            
          
        </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link to="/gerenciar-cozinha">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
export default CozinhaAddProduto;

        
