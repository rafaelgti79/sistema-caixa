import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function GerenciarCozinha() {
  
  

  return (
    <div className="containercd">
          <div className="colunatabel">
           <Link to="/cozinha-add-produto">Produto</Link>
           <Link to="/app/cozinha-add-categoria">Categoria</Link>
           <Link to="/cozinha-produtos">Produtos</Link>
           <Link to="/cozinha-relatorio">Relatorio</Link>
           <Link to="/app/home">Voltar</Link>
          </div>
       
    </div>
  );
}
export default GerenciarCozinha;
      
      
        
           
                   
            
          
             

        
