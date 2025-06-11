import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function GerenciarCozinha() {
  
  

  return (
    <div className="containercd">
          <div className="colunatabel">
           <Link to="/cozinha-add-produto">Produto</Link>
           <Link to="/cozinha-add-categoria">Categoria</Link>
           <Link to="/lojas">Produtos</Link>
           <Link to="/cartoes">Relatorio</Link>
           <Link to="/conta">Voltar</Link>
          </div>
       
    </div>
  );
}
export default GerenciarCozinha;
      
      
        
           
                   
            
          
             

        
