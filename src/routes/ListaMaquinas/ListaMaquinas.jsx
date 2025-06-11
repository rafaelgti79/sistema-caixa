import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import './ListaMaquinas.css';

const url = "http://localhost:3000/maquinas";

function ListaMaquinas() {
const {data: items} = useFetch(url)


  return (
    <div className="containerr">
      <h1>LISTA MAQUINAS</h1>

      <table className="excel-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>EI</th>
      <th>SI</th>
      <th>JOGO</th>
      <th>Porcentagem</th>
      <th>ST</th>
      <th>MAQNRO</th>
      <th>Percentual</th>
    </tr>
  </thead>
  <tbody>
    {items && items.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.EI}</td>
        <td>{item.SI}</td>
        <td>{item.JOGO}</td>
        <td>{item.Porcentagem}</td>
        <td>{item.ST}</td>
        <td>{item.MAQNRO}</td>
        <td>{item.percentual}</td>
      </tr>
    ))}
  </tbody>
</table>


      <div className="botao-salvar">
          
          <Link to="/">Voltar</Link>
        </div>
    </div>
  );
}
export default ListaMaquinas;
           


        
