import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function HomeCaixa() {
  
  

  return (
    <div className="containercd">
          <div className="colunatabel">
           <Link to="#">Conta</Link>
           <Link to="#">Data</Link>
           <Link to="#">Fundo I</Link>
           <Link to="/app/fecharCaixa">Fechar 0</Link>
            <Link to="/app/fechamentomaquinas">Fechar 2</Link>
            <Link to="/app/despesas">Despesas</Link>
            <Link to="/app/reforco">Reforço</Link>
            <Link to="/app/cartao">Cartões</Link>
            <Link to="/app/dinheiro">Dinheiro</Link>
            <Link to="/app/sangria">Sangria</Link>
            <Link to="/app/extras">extras</Link>
            <Link to="/">Sair Deslogar</Link>
          </div>
                    
       
    </div>
  );
}
export default HomeCaixa;
      
      
        
           
                   
            
          
             

        
