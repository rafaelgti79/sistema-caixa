import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import './home.css';

const url = "http://localhost:3000/caixa";


function Home() {
  
  const { data: conta, } = useFetch('http://localhost:3000/conta');
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


      <div className="grid-row"><span className="label">RAFAEL:</span> <span className="value">X</span></div>

      
      <div className="grid-row"><span className="label">DATA:</span> <span className="value">{item.data}</span></div>
      <div className="grid-row"><span className="label">SETOR:</span> <span className="value">SETOR {item.setor}</span></div>
      <div className="grid-row"><span className="label">FUNDO INICIAL:</span> <span className="value">R$: {item.fundoInicial}</span></div>
      <div className="grid-row"><span className="label">LOJA:</span> <span className="value">{item.loja}</span></div>
      <p>INFORMAÇÕES DO CAIXA</p>
      <div className="grid-row"><span className="label">Fechamento:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Despesas:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Reforço:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Cartões:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Cheques:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Vales:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Sangrias:</span> <span className="value">0</span></div>
      <p>PARCIAL DO CAIXA</p>
      <div className="grid-row"><span className="label">Arrecadações:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Pagamentos:</span> <span className="value">0</span></div>
      <div className="grid-row"><span className="label">Resultado parcial:</span> <span className="value">0</span></div>
    </li>
  ))}
</ul>
      </div>
 </div>

  );
}
export default Home;
            
          
       
      
           
                   

        
