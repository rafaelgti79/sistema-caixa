import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import './home.css';

const url = "http://localhost:3000/caixa";

function Home() {
  
  const {data: items} = useFetch(url)
  

  return (
      <div className="containerhome">
        <div className="colunatabel">
        <Link to="/abrir-caixa">Abrir Caixa</Link>
        <Link to="/lista-maquinas">Lista de maquinas</Link>
        <Link to="/cadastros">Cadastro Gerais</Link>
        <Link to="/relatorios">Relatorio</Link>
        <Link to="/fechamento">Fechamento</Link>
        <Link to="/procurar-erros">Procurar erros</Link>
        <Link to="/despesas-extra">Despesas Extras</Link>
        <Link to="/gerenciar-cozinha">Gerenciar Cozinha</Link>
        <Link to="/checar-leitura">Checar Leitura</Link>
        <Link to="/gerenciar-sistema">Gerenciar Sistema</Link>
        <Link to="/pagamento-superios">Pagamento Superior</Link>
        <Link to="/procurar-pagamentos">Procurar Pagamentos</Link>        
                 
      </div>

<div>
  <ul className="grid-list">
  {items && items.map((item) => (
    <li key={item.id} className="grid-item">
      
      <p><strong>DATA:</strong> {item.data}</p>
      <p><strong>SETOR:</strong> {item.setor}</p>
      <p><strong>FUNDO INICIAL:</strong> {item.fundoInicial}</p>
      <p><strong>LOJA:</strong> {item.loja}</p>
      

    </li>
  ))}
</ul>
      </div>
 </div>

  );
}
export default Home;
            
          
       
      
           
                   

        
