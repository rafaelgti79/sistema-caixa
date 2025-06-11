import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './cadastro.css';

function Cadastro() {
  
  

  return (
    <div className="containercd">
          <div className="colunatabel">
           <Link to="/maquinas">Maquinas</Link>
           <Link to="/jogos">Jogos</Link>
           <Link to="/lojas">Lojas</Link>
           <Link to="/cartoes">Cartões</Link>
            <Link to="/conta">Contas</Link>
          </div>
       
    </div>
  );
}
export default Cadastro;
      
      
        
           
                   
            
          
             

        
