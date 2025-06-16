import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { useNavigate } from 'react-router-dom';

const urlCaixa = "http://localhost:3000/caixa";
const urlFecharCaixa = "http://localhost:3000/fecharcaixa";

function FecharCaixa() {
  const [totalEntrada, setTotalEntrada] = useState('');
  const navigate = useNavigate();
  const { httpConfig } = useFetch(urlFecharCaixa);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado) {
      alert("Usuário não está logado");
      return;
    }

    // Buscar caixa aberto do usuário
    const res = await fetch(`${urlCaixa}?usuario=${usuarioLogado.nome}&status=aberto`);
    const caixasAbertos = await res.json();

    if (caixasAbertos.length === 0) {
      alert("Nenhum caixa aberto para fechar");
      return;
    }

    const caixaAberto = caixasAbertos[0];

    // Atualizar status do caixa para fechado
    await fetch(`${urlCaixa}/${caixaAberto.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'fechado' }),
    });

    // Salvar fechamento no histórico
    const fecharcaixa = {
      totalEntrada,
      usuario: usuarioLogado.nome,
      dataFechamento: new Date().toISOString(),
    };
    httpConfig(fecharcaixa, "POST");

    // Atualiza o controle local
    localStorage.setItem(`caixaAberto_${usuarioLogado.nome}`, 'false');
    localStorage.setItem(`caixaFechado_${usuarioLogado.nome}`, 'true');

    navigate('/app/home-caixa');
  };

  return (
    <div className="containerCaixa">
      <h1>RESUMO DO MEU FECHAMENTO</h1>
      <form onSubmit={handleSubmit}>
        <div className="coluna-esquerda-caixa">
          <label>TOTAL DE ENTRADA :</label>
          <input
            type="text"
            value={totalEntrada}
            onChange={(event) => setTotalEntrada(event.target.value)}
          />
        </div>
        <button className='btn-abrir'>Fechar Caixa</button>
      </form>
    </div>
  );
}

export default FecharCaixa;



/* backup funcionando 
import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { useNavigate } from 'react-router-dom';


const url = "http://localhost:3000/fecharcaixa";

function FecharCaixa() {
  const [totalEntrada, setTotalEntrada] = useState('');
  const navigate = useNavigate();
  
  
  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const usuarioKey = usuarioLogado.nome;


    const fecharcaixa = {
      totalEntrada,
      usuario: usuarioLogado.nome,  // ou usuarioId: usuarioLogado.id
    };
    
    httpConfig(fecharcaixa, "POST");

  // Atualiza o estado de controle por usuário
    localStorage.setItem(`caixaAberto_${usuarioKey}`, 'false');
    localStorage.setItem(`caixaFechado_${usuarioKey}`, 'true');


    navigate('/app/home-caixa');
  };
      
      

  return (
    <div className="containerCaixa">
      <h1>RESUMO DO MEU FECHAMENTO</h1>
      <form onSubmit={handleSubmit}>
          <div className="coluna-esquerda-caixa">
            <label>TOTAL DE ENTRADA :</label>
            <input type="text" value={totalEntrada} onChange={(event) => setTotalEntrada(event.target.value)} />
       
          </div>
          <button className='btn-abrir'>Fechar Caixa</button>
         
      </form>
    </div>
  );
}
export default FecharCaixa;
 */           
        
          
       
        

           
           

        
