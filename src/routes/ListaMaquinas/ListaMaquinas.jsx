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

      <ul>
        {items && items.map((item) => (
          <li key={item.id}>
            <li>{item.id} {item.EI} 
              {item.SI} {item.JOGO} 
              {item.Porcentagem} {item.ST} 
              {item.MAQNRO} {item.percentual} </li>
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
           


        
