import React, { useState } from 'react';


function Cartão() {
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
      <h1>Cadastro de Tipos de cartões</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>LOJA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
           <label>NOME: DESCRIÇÃO DO CARTÃO:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>PORCENTAGEM DO ALUGUEL:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
          </div>
            
          
        </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Cartão;

        
