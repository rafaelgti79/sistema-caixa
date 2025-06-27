import React, { useState } from 'react';
import api from '../../constants/api.js';


function Reforco() {
  
  const [valor, setValor] = useState('');
   

   const handleSubmit = async (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Adicionar data atual altomatico
    const dataHoje = new Date().toISOString().split('T')[0];

    
    const reforco = {
      valor,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };

     try {
      await api.post('/reforco', reforco);
      setValor('');
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
    }
  };

  return (
    <div className="containerDespesas">
      <h1>REFORÇO</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />
          </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Reforco;
           
            

        
            
          
       

        
