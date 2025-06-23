import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { useNavigate } from 'react-router-dom';

const urlCaixa = "http://localhost:3000/caixa";
const urlFecharCaixa = "http://localhost:3000/fecharcaixa";
const urlDespesas = "http://localhost:3000/despesas";
const urlCartoes = "http://localhost:3000/cartao"; // Ajuste conforme seu endpoint real
const urlDinheiro = "http://localhost:3000/dinheiro"; // Ajuste conforme seu endpoint real



function FecharCaixa() {
  const [totalEntrada, setTotalEntrada] = useState('');
  const [caixaAberto, setCaixaAberto] = useState(null);
  const [despesasTotal, setDespesasTotal] = useState(0);
  const [cartoesTotal, setCartoesTotal] = useState(0);
  const [dinheiroTotal, setDinheiroTotal] = useState(0);
  const navigate = useNavigate();
  const { httpConfig } = useFetch(urlFecharCaixa );

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

      // Buscar dinheiro
      const resDinheiro = await fetch(`${urlDinheiro}?usuario=${usuarioLogado.nome}`);
      const dinheiro = await resDinheiro.json();
      const totalDinheiro = dinheiro.reduce((acc, item) => acc + Number(item.valor || 0), 0);
      setDinheiroTotal(totalDinheiro);
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
  const bruto = entrada + cartoesTotal ;
  const liquido = bruto - despesasTotal;
  const composicao = fundoInicial + bruto;
  const fechamentoFinal = fundoInicial + entrada - despesasTotal;
  const sobra = 0;
  const falta = 0;

  // Atualizar o status do caixa para fechado
  await fetch(`${urlCaixa}/${caixaAberto.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'fechado',
      despesas: despesasTotal,
      cartao: cartoesTotal,
      dinheiro: dinheiroTotal,
      fechamento: fechamentoFinal,
      totalEntrada: entrada,
    }),
  });

  // Salvar fechamento do caixa
  const fecharCaixaRegistro = {

    totalEntrada: entrada,
    usuario: usuarioLogado.nome,
    dataFechamento: new Date().toISOString(),
    fechamentoFinal,
    despesas: despesasTotal,
    cartao: cartoesTotal,
    dinheiro: dinheiroTotal,
    loja: caixaAberto.loja || '',
    setor: caixaAberto.setor || '',
  };
  httpConfig(fecharCaixaRegistro, "POST");

  // Salvar CARTÃO
  const novoCartao = {
    valor: cartoesTotal,
    usuario: usuarioLogado.nome,
    dataHora: new Date().toLocaleString('pt-BR', { hour12: false }),
  };
  await fetch("http://localhost:3000/cartao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoCartao),
  });

  // Salvar DINHEIRO
  const novoDinheiro = {
    valor: entrada,
    usuario: usuarioLogado.nome,
    dataHora: new Date().toLocaleString('pt-BR', { hour12: false }),
  };
  await fetch("http://localhost:3000/dinheiro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoDinheiro),
  });

  // Salvar FECHAMENTO DE MÁQUINAS
  const fechamentoMaquinas = {
    valor: bruto,
    usuario: usuarioLogado.nome,
    dataHora: new Date().toLocaleString('pt-BR', { hour12: false }),
  };
  await fetch("http://localhost:3000/fecharmaquinas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fechamentoMaquinas),
  });

  

  // Histórico geral
  await fetch('http://localhost:3000/historicocaixa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: usuarioLogado.nome,
      data: new Date().toISOString(),
      bruto,
      liquido,
      composicao,
      sobra,
      falta,
      cartao: cartoesTotal,
      dinheiro: entrada,
    }),
  });

  // Limpar status local
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
          <button type="submit" style={{ marginTop: '10px', background: 'red', color: 'white' }}>
  Fechar o Caixa (salvar e limpar)
</button>
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
        
          
       
        

           
           

        
