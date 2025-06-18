import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { useNavigate } from 'react-router-dom';

const urlCaixa = "http://localhost:3000/caixa";
const urlFecharCaixa = "http://localhost:3000/fecharcaixa";
const urlDespesas = "http://localhost:3000/despesas";
const urlCartoes = "http://localhost:3000/cartoes"; // Ajuste conforme seu endpoint real

function FecharCaixa() {
  const [totalEntrada, setTotalEntrada] = useState('');
  const [caixaAberto, setCaixaAberto] = useState(null);
  const [despesasTotal, setDespesasTotal] = useState(0);
  const [cartoesTotal, setCartoesTotal] = useState(0);
  const navigate = useNavigate();
  const { httpConfig } = useFetch(urlFecharCaixa);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    const buscarDados = async () => {
      if (!usuarioLogado) return;

      // Buscar caixa aberto
      const resCaixa = await fetch(`${urlCaixa}?usuario=${usuarioLogado.nome}&status=aberto`);
      const caixas = await resCaixa.json();
      const caixa = caixas[0];
      if (!caixa) return;

      setCaixaAberto(caixa);

      // Buscar despesas
      const resDespesas = await fetch(`${urlDespesas}?usuario=${usuarioLogado.nome}`);
      const despesas = await resDespesas.json();
      const totalDespesas = despesas.reduce((acc, item) => acc + Number(item.valor || 0), 0);
      setDespesasTotal(totalDespesas);

      // Buscar cartões
      const resCartoes = await fetch(`${urlCartoes}?usuario=${usuarioLogado.nome}`);
      const cartoes = await resCartoes.json();
      const totalCartoes = cartoes.reduce((acc, item) => acc + Number(item.valor || 0), 0);
      setCartoesTotal(totalCartoes);
    };

    buscarDados();
  }, [usuarioLogado]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!usuarioLogado || !caixaAberto) {
      alert("Usuário ou caixa não encontrado");
      return;
    }

    const fundoInicial = Number(caixaAberto.fundoInicial || 0);
    const entrada = Number(totalEntrada || 0);
    const fechamentoFinal = fundoInicial + entrada - despesasTotal;

    // Atualizar caixa
    await fetch(`${urlCaixa}/${caixaAberto.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'fechado',
        despesas: despesasTotal,
        cartoes: cartoesTotal,
        fechamento: fechamentoFinal,
        totalEntrada: entrada,
      }),
    });

    // Salvar histórico de fechamento
    const fecharCaixaRegistro = {
  totalEntrada: entrada,
  usuario: usuarioLogado.nome,
  dataFechamento: new Date().toISOString(),
  fechamentoFinal,
  despesas: despesasTotal,
  cartoes: cartoesTotal,
  loja: caixaAberto.loja || '',
  setor: caixaAberto.setor || '',
};

    httpConfig(fecharCaixaRegistro, "POST");

    localStorage.setItem(`caixaAberto_${usuarioLogado.nome}`, 'false');
    localStorage.setItem(`caixaFechado_${usuarioLogado.nome}`, 'true');

    navigate('/app/home');
  };

  return (
    <div className="containerCaixa">
      <h1>RESUMO DO MEU FECHAMENTO</h1>
      {caixaAberto ? (
        <form onSubmit={handleSubmit}>
          <div className="coluna-esquerda-caixa">
            <p><strong>Fundo Inicial:</strong> R$ {Number(caixaAberto.fundoInicial).toFixed(2)}</p>
            <p><strong>Total Cartões:</strong> R$ {cartoesTotal.toFixed(2)}</p>
            <p><strong>Total Despesas:</strong> R$ {despesasTotal.toFixed(2)}</p>
            <label>Total de Entrada (dinheiro):</label>
            <input
              type="text"
              value={totalEntrada}
              onChange={(event) => setTotalEntrada(event.target.value)}
              required
            />
            <p><strong>Fechamento Final:</strong> R$ {(Number(caixaAberto.fundoInicial) + Number(totalEntrada || 0) - despesasTotal).toFixed(2)}</p>
          </div>
          <button className='btn-abrir'>Fechar Caixa</button>
        </form>
      ) : (
        <p>Carregando dados do caixa...</p>
      )}
    </div>
  );
}

export default FecharCaixa;






/* backup funcionando 2.0
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

    navigate('/app/home');
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



/* backup funcionando 1.0 
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
        
          
       
        

           
           

        
