import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import './AbrirCaixa.css';

const url = "http://localhost:3000/caixa";

function AbrirCaixa() {
  const [loja, setLoja] = useState('');
  const [fundoInicial, setFundoInicial] = useState('');
  const [data, setData] = useState('');
  const [setor, setSetor] = useState('');
  const { data: lojas, } = useFetch('http://localhost:3000/lojas');
  
  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const caixa = {
      loja,
      fundoInicial,
      data,
      setor,
      
    };
    
    httpConfig(caixa, "POST");
  };
      
      

  return (
    <div className="containerCaixa">
      <h1>COLOQUE O FUNDO INICIAL</h1>
      <form onSubmit={handleSubmit}>
       

          <div className="coluna-esquerda-caixa">
            <label>FUNDO INICIAL :</label>
            <input type="text" value={fundoInicial} onChange={(event) => setFundoInicial(event.target.value)} />
           <label>DATA :</label>
            <input type="date" value={data} onChange={(event) => setData(event.target.value)} />
            <label>SETOR :</label>
            <input type="text" value={setor} onChange={(event) => setSetor(event.target.value)} />

            <label>Loja:</label>
<select
  value={loja}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setLoja(nomeSelecionado);
    const jogoSelecionado = lojas.find(j => j.loja === nomeSelecionado);
    if (jogoSelecionado) {
      setValorJogo(jogoSelecionado.valorJogo);
    }
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
           
          <button className='btn-abrir'>Abrir Caixa</button>
         
      </form>
    </div>
  );
}
export default AbrirCaixa;
            
        
          
       
        

        
