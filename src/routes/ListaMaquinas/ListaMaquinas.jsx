import React, { useEffect, useState } from 'react';
import api from '../../constants/api.js'; // ajuste o caminho conforme sua estrutura
import './ListaMaquinas.css';

function ListaMaquinas() {
  const [items, setItems] = useState([]);

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

  return (
    <div className="table-container">
      <h1>LISTA MAQUINAS</h1>

      <table className="excel-table">
  <thead>
    <tr>
      <th>N</th>
      <th>EI</th>
      <th>SI</th>
      <th>JOGO</th>
      <th>$</th>
      <th>ST</th>
      <th>MAQNRO</th>
      <th>%</th>
    </tr>
  </thead>
  <tbody>
    {items && items.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.inicial}</td>
        <td>{item.final}</td>
        <td>{item.jogo}</td>
        <td>{item.valorJogo}</td>
        <td>{item.setor}</td>
        <td>{item.MAQNRO}</td>
        <td>{item.percentual}0%</td>
      </tr>
    ))}
  </tbody>
</table>

</div>
     
  );
}
export default ListaMaquinas;
           


        
