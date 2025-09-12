import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../constants/api.js'; // ajuste o caminho conforme sua estrutura
import './ListaMaquinas.css';

function ListaMaquinas() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMaquinas() {
      try {
        const response = await api.get('/maquinas');
        setItems(response.data);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      }
    }

    fetchMaquinas();
  }, []);

  // Função para editar uma máquina
  const handleEdit = (id) => {
    console.log(`Editar a máquina com ID: ${id}`);
    // Redirecionar para a página de edição ou abrir modal de edição
    navigate(`/app/editarmaquina/${id}`); // Exemplo se usar react-router
  };

  // Função para excluir uma máquina
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
      try {
        await api.delete(`/maquinas/${id}`);
        setItems(items.filter(item => item.id !== id)); // Remove a máquina da lista após a exclusão
        alert('Máquina excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir máquina:', error);
        alert('Erro ao excluir a máquina.');
      }
    }
  };

  return (
    <div className="table-container">
      <h1>LISTA MAQUINAS</h1>

      <table className="excel-table">
<thead>
  <tr>
    <th>N</th><th>EI</th><th>SI</th><th>JOGO</th>
    <th>$</th><th>ST</th><th>%</th><th>Ações</th>
  </tr>
</thead>
        <tbody>
          {items && items.map((item) => (
            <tr key={item.id}>
              <td>{item.numeroMaquina}</td>
              <td>{item.inicial}</td>
              <td>{item.final}</td>
              <td>{item.jogo}</td>
              <td>{item.valor}</td>
              <td>{item.setor}</td>
             
              <td>{item.percentual}0%</td>
              <td>
                {/* Botões de editar e excluir */}
                <button onClick={() => handleEdit(item.id)} className="btn-edit">Editar</button>
                <button onClick={() => handleDelete(item.id)} className="btn-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaMaquinas;
