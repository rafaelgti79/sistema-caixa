import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../constants/api.js';
import './ResumoMaquinas.css';

function ResumoMaquinas() {
  const [items, setItems] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMaquinas() {
      try {
        const response = await api.get('/fecharmaquinas');

        // Se a data ainda não foi selecionada, não filtra
        if (!dataSelecionada) {
          setItems([]);
          return;
        }

        // Filtra pela data selecionada (formato yyyy-mm-dd)
        const filtrados = response.data.filter(item => {
          const dataItem = new Date(item.dataHora).toISOString().split('T')[0];
          return dataItem === dataSelecionada;
        });

         // Ordena pela máquina de forma crescente (1 → 44)
      filtrados.sort((a, b) => a.maquina - b.maquina);

        setItems(filtrados);
      } catch (error) {
        console.error('Erro ao buscar máquinas:', error);
      }
    }

    fetchMaquinas();
  }, [dataSelecionada]); // Recarrega sempre que a data mudar

  return (
    <div className="table-container">
      <h1>RESUMO MÁQUINAS</h1>

      <div className="filtro-data">
        <label htmlFor="data">Selecione a data: </label>
        <input
          type="date"
          id="data"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
      </div>

      <table className="excel-table">
        <thead>
          <tr>
            <th>N</th>
            <th>EI</th>
            <th>EF</th>
            <th>SOMA E</th>
            <th>SI</th>
            <th>SF</th>
            <th>SOMA S</th>
            <th>RESULTADO</th>
            <th>DATA</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && dataSelecionada ? (
            <tr>
              <td colSpan="9">Nenhum dado encontrado para {dataSelecionada}</td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.id}>
                <td>{item.maquina}</td>
                <td>{item.entradaInicial}</td>
                <td>{item.entradaFinal}</td>
                <td>{item.somaEntradas}</td>
                <td>{item.saidaInicial}</td>
                <td>{item.saidaFinal}</td>
                <td>{item.somaSaidas}</td>
                <td>{item.resultado}</td>
                <td>{new Date(item.dataHora).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ResumoMaquinas;
