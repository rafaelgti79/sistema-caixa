import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CozinhaProdutos() {
  
  return (
    <div className="container">
      <h1>PRODUTOS</h1>
     
             <div className="botao-salvar">
               
               <Link to="/gerenciar-cozinha">Voltar</Link>
             </div>
    </div>
      
  );
}
export default CozinhaProdutos;

        
