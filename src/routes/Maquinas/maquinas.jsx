import React, { useState } from 'react';
import './maquinas.css';

function Maquinas() {
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
      <h1>Cadastro de Máquinas</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>Loja:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
            <label>Número da Máquina:</label>
            <input type="text" value={numeroMaquina} onChange={(event) => setNumeroMaquina(event.target.value)} />
            <label>Jogo:</label>
            <input type="text" value={jogo} onChange={(event) => setJogo(event.target.value)} />
            <label>Maquineiro:</label>
            <input type="text" value={maquineiro} onChange={(event) => setMaquineiro(event.target.value)} />
          </div>
          <div className="coluna-direita">
            <label>Setor:</label>
            <input type="text" value={setor} onChange={(event) => setSetor(event.target.value)} />
            <label>Entrada:</label>
            <input type="number" value={entrada} onChange={(event) => setEntrada(event.target.value)} />
            <label>Saída:</label>
            <input type="number" value={saida} onChange={(event) => setSaida(event.target.value)} />
          </div>
        </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Maquinas;

        
