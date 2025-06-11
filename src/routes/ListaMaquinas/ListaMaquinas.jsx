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

      <ul className="grid-list">
  {items && items.map((item) => (
    <li key={item.id} className="grid-item">
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>EI:</strong> {item.EI}</p>
      <p><strong>SI:</strong> {item.SI}</p>
      <p><strong>JOGO:</strong> {item.JOGO}</p>
      <p><strong>Porcentagem:</strong> {item.Porcentagem}</p>
      <p><strong>ST:</strong> {item.ST}</p>
      <p><strong>MAQNRO:</strong> {item.MAQNRO}</p>
      <p><strong>Percentual:</strong> {item.percentual}</p>
    </li>
  ))}
</ul>

      <div className="botao-salvar">
          
          <Link to="/">Voltar</Link>
        </div>
    </div>
  );
}
export default ListaMaquinas;
           


        
