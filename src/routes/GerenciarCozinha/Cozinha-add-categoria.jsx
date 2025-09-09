import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { useNavigate } from 'react-router-dom';


function CozinhaAddCategoria() {
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  // Carregar lojas no início
  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar Categorias:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!categoria.trim()) {
      alert("Nome da Categoria é obrigatório.");
      return;
    }

    try {
      const response = await api.post('/categorias', { categoria });
      setCategorias(prev => [...prev, response.data]);
      setCategoria('');
    } catch (error) {
      console.error("Erro ao salvar Categoria:", error);
      alert("Erro ao salvar Categoria.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir esta Categoria?");
    if (!confirm) return;

    try {
      await api.delete(`/categorias/${id}`);
      setCategorias(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error("Erro ao excluir Categoria:", error);
      alert("Erro ao excluir Categoria.");
    }
  };

  return (
    <div className="containerLoja">
      <h1>Cadastro de Categorias</h1>
      <form onSubmit={handleSubmit}>
        <label>NOME DA CATEGORIA:</label>
        <input
          className='inpuCaixaMaquina'
          type="text"
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
        />

        <div className='btn-abrirMaquina'>
          <button className='btn-salvar' type="submit">Salvar</button>
          <button className='btn-voltar' type="button" onClick={() => navigate('/app/gerenciar-cozinha')}>Voltar</button>
        </div>
      </form>

      {/* 🧾 Lista de lojas */}
      <div className="lista-lojas">
        <h2>CATEGORIAS:</h2>
        <ul>
          {categorias.map((item) => (
            <li key={item.id} className="lojas-item">
              {item.categoria}
              <button
                className="btn-excluir"
                onClick={() => handleDelete(item.id)}
                title="Excluir Categoria"
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

export default CozinhaAddCategoria;
