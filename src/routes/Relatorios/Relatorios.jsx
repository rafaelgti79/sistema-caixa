import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Relatorios() {
  
  

  return (
    <div className="containercd">
          <div className="colunatabel">
           <Link to="/app/resumototal">Resumo</Link>
           <Link to="/app/historicofechamento">Borderô</Link>
           
           <Link to="/app/filtrorelatoriomaquina">Maquinas</Link>
            <Link to="/app/relatoriomaindespesas">Despesas</Link>
            <Link to="/app/resumomaquinas">Resumo Maquinas</Link>
            <Link to="/conta">D.Extras</Link>
            <Link to="/conta">Historico</Link>
            <Link to="/conta">Arrecadação</Link>
            <Link to="/conta">Pagamentos</Link>
            <Link to="/conta">Maquinas Excel</Link>
            <Link to="/conta">Despesas Excel</Link>
            
            
            <Link to="/app/home">Voltar</Link>
          </div>
       
    </div>
  );
}
export default Relatorios;
      
            
           
      
        
           
                   
            
          
             

        
