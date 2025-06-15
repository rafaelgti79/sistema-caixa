import React, { useState } from 'react';
import './despesas-extra.css';


function DespesasExtras() {
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
    <div className="containerDespesas">
      <h1>DESPESAS EXTRAS</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>DESCRICAO :</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
           <label>VALOR:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>CATEGORIA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>DATA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>LOJA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default DespesasExtras;
            
          
       

        
