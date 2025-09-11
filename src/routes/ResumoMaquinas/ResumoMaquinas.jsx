import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../../constants/api.js';
import './ResumoMaquinas.css';

function ResumoMaquinas() {
  const [items, setItems] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
  async function fetchUsuarios() {
    try {
      const response = await api.get('/conta'); // ajuste para sua rota real
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }

  fetchUsuarios();
}, []);


  useEffect(() => {
  async function fetchMaquinas() {
    try {
      const response = await api.get('/fecharmaquinas');

      if (!dataSelecionada || !usuarioSelecionado) {
        setItems([]);
        return;
      }

      const filtrados = response.data.filter(item => {
        const dataItem = new Date(item.dataHora).toISOString().split('T')[0];
        return (
          dataItem === dataSelecionada &&
          String(item.usuarioId) === String(usuarioSelecionado)
        );
      });

      filtrados.sort((a, b) => a.maquina - b.maquina);

      setItems(filtrados);
    } catch (error) {
      console.error('Erro ao buscar máquinas:', error);
    }
  }

  fetchMaquinas();
}, [dataSelecionada, usuarioSelecionado]);


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

<div className="filtro-usuario">
  <label htmlFor="usuario">Selecione o usuário: </label>
  <select
    id="usuario"
    value={usuarioSelecionado}
    onChange={(e) => setUsuarioSelecionado(e.target.value)}
  >
    <option value="">-- Selecione --</option>
    {usuarios.map((usuario) => (
      <option key={usuario.id} value={usuario.id}>
        {usuario.nome}
      </option>
    ))}
  </select>
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
