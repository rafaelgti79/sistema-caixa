import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './cadastro.css';

function Cadastro() {
  
  

  return (
    <div className="containercd">
          <div className="colunatabel">
           <Link to="/app/maquinas">Maquinas</Link>
           <Link to="/app/jogos">Jogos</Link>
           <Link to="/app/lojas">Lojas</Link>
           <Link to="/app/cadastrocartao">Cartões</Link>
            <Link to="/app/conta">Contas</Link>
          </div>
       
    </div>
  );
}
export default Cadastro;
      
      
        
           
                   
            
          
             

        
