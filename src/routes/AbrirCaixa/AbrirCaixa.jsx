import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function AbrirCaixa() {
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
      <h1>COLOQUE O FUNDO INICIAL</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>FUNDO INICIAL :</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
           <label>DATA :</label>
            <input type="date" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>SETOR :</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>LOJA :</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
           
          </div>
            
          
        </div>
        <div className="botao-salvar">
          <button type="submit">Abrir Caixa</button>
          <Link to="/">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
export default AbrirCaixa;

        
