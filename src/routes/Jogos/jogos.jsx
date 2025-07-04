import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../constants/api.js'; 
import { useNavigate } from 'react-router-dom';
import './jogo.css';

function Jogos() {
  
  const [nomedojogo, setNomeJogo] = useState('');
  const [valorJogo, setValorJogo] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    

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
<div className="containerJogo">
  <h1>Cadastro de Jogos</h1>
  <form onSubmit={handleSubmit}>
    
      <label>NOME DO JOGO:</label>
      <input className='inpuCaixaMaquina' type="text" value={nomedojogo} onChange={(event) => setNomeJogo(event.target.value)} />

<label>Valor do Jogo:</label>
<select className='inpuCaixaSelectMaquina' value={valorJogo} onChange={(event) => setValorJogo(event.target.value)}>
  <option value=""></option>
  <option value="0.25">0.25</option>
  <option value="0.05">0.05</option>
  <option value="0.01">0.01</option>
</select>

        <div className='btn-abrirMaquina'>
          <button className='btn-salvar'  type="submit">Salvar</button>
         
          <button className='btn-voltar' onClick={() => navigate('/app/cadastros')}>Voltar</button>
         </div>
      </form>
    </div>
  );
}
export default Jogos;
          
            
          
        

        
