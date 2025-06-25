import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/sangria";


function Sangria() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [contas, setContas] = useState('');
  const [loja, setLoja] = useState('');

 const { data: lojas, } = useFetch('http://localhost:3000/lojas');
 const { data: conta, } = useFetch('http://localhost:3000/conta');
 const {data: items, httpConfig} = useFetch(url);

  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Adicionar data atual altomatico
      const dataHoje = new Date().toISOString().split('T')[0];
    
    const sangria = {

      descricao,
      valor,
      contas,
      loja,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };
    httpConfig(sangria, "POST");
    // Limpar os campos
  setDescricao('');
  setValor('');
  setContas('');
  setLoja('');

  };

  
  return (
    <div className="containerDespesas">
      <h1>SANGRIA</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>DESCRICAO :</label>
            <input type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />

<select
  value={contas}
  onChange={(event) => {
    const contaSelecionado = event.target.value;
    setContas(contaSelecionado);
  }}
>
  <option value="">RESPONSAVEL</option>
  {conta && conta.map((j) => (
    <option key={j.id || j.nome} value={j.nome}>
      {j.nome}
    </option>
  ))}
</select>

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
export default Sangria;
            
          
       

        
