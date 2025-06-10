import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function Home() {
  
  

  return (
    <div className="container">
      
      
        <div className="colunas">
          <div className="coluna-esquerda">
           <Link to="/cadastros">Cadastro</Link>
            <Link to="/lista">Lista de maquinas</Link>
          </div>
        </div>
    </div>
  );
}
export default Home;
            
          
       
      
           
                   

        
