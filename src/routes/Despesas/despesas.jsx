import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/despesas";


function Despesas() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loja, setLoja] = useState('');

 const { data: lojas, } = useFetch('http://localhost:3000/lojas');

  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

      // Adicionar data atual altomatico
      const dataHoje = new Date().toISOString().split('T')[0];

    
    const despesas = {

      descricao,
      valor,
      categoria,
      loja,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };
    httpConfig(despesas, "POST");
    // Limpar os campos
  setDescricao('');
  setValor('');
  setCategoria('');
  setLoja('');

  };

  return (
    <div className="containerDespesas">
      <h1>DESPESAS</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>DESCRICAO :</label>
            <input type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />
            <label>CATEGORIA:</label>
            <input type="text" value={categoria} onChange={(event) => setCategoria(event.target.value)} />

            <select
  value={loja}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setLoja(nomeSelecionado);
    
  }}
>
  <option value="">Selecione uma Loja</option>
  {lojas && lojas.map((j) => (
    <option key={j.id || j.loja} value={j.loja}>
      {j.loja}
    </option>
  ))}
</select>
          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Despesas;
            
          
       

        
