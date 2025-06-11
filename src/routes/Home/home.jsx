import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function Home() {
  
  

  return (
      <div className="containercd">
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
 </div>

  );
}
export default Home;
            
          
       
      
           
                   

        
