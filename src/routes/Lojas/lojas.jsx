import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { useNavigate } from 'react-router-dom';
import './lojas.css';

function Loja() {
  const [loja, setLoja] = useState('');
  const [lojas, setLojas] = useState([]);
  const navigate = useNavigate();

  // Carregar lojas no início
  useEffect(() => {
    carregarLojas();
  }, []);

  const carregarLojas = async () => {
    try {
      const response = await api.get('/lojas');
      setLojas(response.data);
    } catch (error) {
      console.error("Erro ao carregar lojas:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!loja.trim()) {
      alert("Nome da loja é obrigatório.");
      return;
    }

    try {
      const response = await api.post('/lojas', { loja });
      setLojas(prev => [...prev, response.data]);
      setLoja('');
    } catch (error) {
      console.error("Erro ao salvar loja:", error);
      alert("Erro ao salvar loja.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir esta loja?");
    if (!confirm) return;

    try {
      await api.delete(`/lojas/${id}`);
      setLojas(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error("Erro ao excluir loja:", error);
      alert("Erro ao excluir loja.");
    }
  };

  return (
    <div className="containerLoja">
      <h1>Cadastro de Lojas</h1>
      <form onSubmit={handleSubmit}>
        <label>NOME DA LOJA:</label>
        <input
          className='inpuCaixaMaquina'
          type="text"
          value={loja}
          onChange={(event) => setLoja(event.target.value)}
        />

        <div className='btn-abrirMaquina'>
          <button className='btn-salvar' type="submit">Salvar</button>
          <button className='btn-voltar' type="button" onClick={() => navigate('/app/cadastros')}>Voltar</button>
        </div>
      </form>

      {/* 🧾 Lista de lojas */}
      <div className="lista-lojas">
        <h2>Lojas cadastradas:</h2>
        <ul>
          {lojas.map((item) => (
            <li key={item.id} className="lojas-item">
              {item.loja}
              <button
                className="btn-excluir"
                onClick={() => handleDelete(item.id)}
                title="Excluir loja"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Loja;
