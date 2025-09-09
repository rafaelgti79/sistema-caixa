import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api.js'; 
import './jogo.css';

function Jogos() {
  const [nomedojogo, setNomeJogo] = useState('');
  const [valorJogo, setValorJogo] = useState('');
  const [jogos, setJogos] = useState([]);
  const navigate = useNavigate();

  // Buscar jogos ao carregar
  useEffect(() => {
    fetchJogos();
  }, []);

  const fetchJogos = async () => {
    try {
      const res = await api.get("/jogos");
      setJogos(res.data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const jogo = {
        nomedojogo,
        valor: parseFloat(valorJogo),
      };

      await api.post("/jogos", jogo);
      alert("Jogo cadastrado com sucesso!");
      setNomeJogo('');
      setValorJogo('');
      fetchJogos(); // Atualiza a lista
    } catch (error) {
      console.error("Erro ao cadastrar jogo:", error);
      alert("Erro ao cadastrar jogo");
    }
  };

  const excluirJogo = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este jogo?")) {
      try {
        await api.delete(`/jogos/${id}`);
        fetchJogos(); // Atualiza a lista
      } catch (error) {
        console.error("Erro ao excluir jogo:", error);
        alert("Erro ao excluir jogo");
      }
    }
  };

  return (
    <div className="containerJogo">
      <h1>Cadastro de Jogos</h1>
      <form onSubmit={handleSubmit}>
        <label>NOME DO JOGO:</label>
        <input
          className='inpuCaixaMaquina'
          type="text"
          value={nomedojogo}
          onChange={(event) => setNomeJogo(event.target.value)}
        />

        <label>Valor do Jogo:</label>
        <select
          className='inpuCaixaSelectMaquina'
          value={valorJogo}
          onChange={(event) => setValorJogo(event.target.value)}
        >
          <option value=""></option>
          <option value="0.25">0.25</option>
          <option value="0.05">0.05</option>
          <option value="0.01">0.01</option>
        </select>

        <div className='btn-abrirMaquina'>
          <button className='btn-salvar' type="submit">Salvar</button>
          <button className='btn-voltar' type="button" onClick={() => navigate('/app/cadastros')}>Voltar</button>
        </div>
      </form>

      <h2>Jogos cadastrados</h2>
      <ul className="lista-jogos">
        {jogos.map((jogo) => (
          <li key={jogo.id} className="jogo-item">
            <span>{jogo.nomedojogo} - R$ {jogo.valor.toFixed(2)}</span>
            <button className="btn-excluir" onClick={() => excluirJogo(jogo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Jogos;
