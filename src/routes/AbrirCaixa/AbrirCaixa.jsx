import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { useNavigate } from 'react-router-dom';
import './AbrirCaixa.css';

const url = "http://localhost:3000/caixa";

function AbrirCaixa() {
  const [loja, setLoja] = useState('');
  const [fundoInicial, setFundoInicial] = useState('');
  const [data, setData] = useState('');
  const [setor, setSetor] = useState('');
  const [fechamento, setFechamento] = useState('');
  const { data: lojas, } = useFetch('http://localhost:3000/lojas');
  const navigate = useNavigate();
  
  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const usuarioKey = usuarioLogado.nome;
    


    const caixa = {
      loja,
      fundoInicial,
      data,
      setor,
      fechamento,
      usuario: usuarioLogado.nome,  // ou usuarioId: usuarioLogado.id
    };
    
    httpConfig(caixa, "POST");

  localStorage.setItem(`caixaAberto_${usuarioKey}`, 'true');
  localStorage.setItem(`caixaFechado_${usuarioKey}`, 'false');

    navigate('/app/home-caixa');
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
            
        
          
       
        

        
