import React, { useState } from 'react';

const url = "http://localhost:3000/despesas";


function Despesas() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loja, setLoja] = useState('');
  const { data: lojas, } = useFetch('http://localhost:3000/despesas');

  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    const caixa = {

      descricao,
      valor,
      categoria,
      loja,
      
    };
    httpConfig(caixa, "POST");
  };

  return (
    <div className="containerDespesas">
      <h1>DESPESAS EXTRAS</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>DESCRICAO :</label>
            <input type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />
            <label>CATEGORIA:</label>
            <input type="text" value={categoria} onChange={(event) => setCategoria(event.target.value)} />
            <label>LOJA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Despesas;
            
          
       

        
