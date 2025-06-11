import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function Home() {
  
  

  return (
      <div className="containercd">
        <div className="colunatabel">
        <Link to="/cadastros">Abrir Caixa</Link>
        <Link to="/lista">Lista de maquinas</Link>
        <Link to="/cadastros">Cadastro Gerais</Link>
        <Link to="/cadastros">Relatorio</Link>
        <Link to="/cadastros">Fechamento</Link>
        <Link to="/cadastros">Procurar erros</Link>
        <Link to="/despesas-extra">Despesas Extras</Link>
        <Link to="/gerenciar-cozinha">Gerenciar Cozinha</Link>
        <Link to="/cadastros">Checar Leitura</Link>
        <Link to="/cadastros">Gerenciar Sistema</Link>
        <Link to="/cadastros">Pagamento Superior</Link>
        <Link to="/cadastros">Procurar Pagamentos</Link>        
                 
      </div>
 </div>

  );
}
export default Home;
            
          
       
      
           
                   

        
