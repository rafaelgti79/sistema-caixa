import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import './FechamentoFinal.css';



function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}



function FechamentoFinal() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const { data: fecharmaquinas } = useFetch('http://localhost:3000/fecharmaquinas');
  const { data: despesas } = useFetch('http://localhost:3000/despesas');
  const { data: sangria } = useFetch('http://localhost:3000/sangria');
  const { data: cartao } = useFetch('http://localhost:3000/cartao');
  const { data: dinheiro } = useFetch('http://localhost:3000/dinheiro');
  const { data: caixa } = useFetch('http://localhost:3000/caixa');
  const { data: reforco } = useFetch('http://localhost:3000/reforco');


  // Busca caixas abertos do usuário
  const { data: caixasAbertos, refetch: refetchCaixas } = useFetch(
  `http://localhost:3000/caixa?status=aberto&usuario=${usuarioLogado.nome}`);


  const [entrada, setEntrada] = useState(0);
  const [saida, setSaida] = useState(0);
  const [bruto, setBruto] = useState(0);
  const [liquido, setLiquido] = useState(0);
  const [composicaoTotal, setComposicaoTotal] = useState(0);
  const [sobra, setSobra] = useState(0);
  const [falta, setFalta] = useState(0);
  const [totalEntrada, setEntradaTotal] = useState(0);
  const [totalSaida, setSaidaTotal] = useState(0);
  const [totalDespesas, setDespesa] = useState(0);
  const [fundoInicial, setFundoInicial] = useState(0);
  const [valorReforco, setValorReforco] = useState(0);
  const [cartaoCredito, setCartaoCredito] = useState(0);
  const [cartaoDebito, setCartaoDebito] = useState(0);
  const [cartaoPix, setCartaoPix] = useState(0);
  const [totalDinheiro, setTotalDinheiro] = useState(0);
  const [totalSangria, setTotalSangria] = useState(0);
  const [dinheiroLiquido, setDinheiroLiquido] = useState(0);



  

  // Calcula totais e atualiza estados
useEffect(() => {
  const dataHoje = new Date().toISOString().split('T')[0];

  if (fecharmaquinas && despesas && sangria && cartao && dinheiro && caixa && reforco) {

    const filtroPorUsuarioEData = (arr, campoData = 'dataHora') =>
      arr.filter((item) =>
        item.usuario === usuarioLogado.nome &&
        item[campoData]?.startsWith(dataHoje)

    // backup item.dataHora?.startsWith(dataHoje)

  );

    const fecharFiltrado = filtroPorUsuarioEData(fecharmaquinas);
    const despesasFiltradas = filtroPorUsuarioEData(despesas, 'data');
    const sangriaFiltrada = filtroPorUsuarioEData(sangria, 'data');
    const cartaoFiltrado = filtroPorUsuarioEData(cartao, 'data');
    const dinheiroFiltrado = filtroPorUsuarioEData(dinheiro, 'data');
    const fundoFiltrado = filtroPorUsuarioEData(caixa, 'data');

     const totalCartaoCredito = cartaoFiltrado
      .filter(item => item.tipo.toLowerCase() === 'credito')
      .reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

    const totalCartaoDebito = cartaoFiltrado
      .filter(item => item.tipo.toLowerCase() === 'debito')
      .reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

    const totalCartaoPix = cartaoFiltrado
      .filter(item => item.tipo.toLowerCase() === 'pix')
      .reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);



  const totalReforco = filtroPorUsuarioEData(reforco, 'data').reduce(
  (acc, item) => acc + parseFloat(item.valor || 0), 0);

    
   const totalEntrada = fecharFiltrado.reduce(
  (acc, item) => acc + parseFloat((item.resultado || "0").toString().replace(',', '.')), 0);

  const totalSaida = fecharFiltrado
  .filter(item => parseFloat((item.resultado || "0").toString().replace(',', '.')) < 0)
  .reduce((acc, item) => acc + Math.abs(parseFloat((item.resultado || "0").toString().replace(',', '.'))), 0);

    const caixaAbertoAtual = Array.isArray(caixasAbertos) && caixasAbertos.length > 0 ? caixasAbertos[0] : null;
    const fundoDoCaixaAtual = caixaAbertoAtual ? parseFloat(caixaAbertoAtual.fundoInicial || 0) : 0;
 
    const totalDespesas = despesasFiltradas.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const totalSangria = filtroPorUsuarioEData(sangria, 'data').reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

    //const totalSangria = filtroPorUsuarioEData(sangria).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const totalCartao = filtroPorUsuarioEData(cartao).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    //const totalDinheiro = filtroPorUsuarioEData(dinheiro).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

    const resultadoBruto = totalEntrada - totalSaida;
    const resultadoLiquido = resultadoBruto - totalDespesas;
    const composicaoTotal = resultadoLiquido + fundoDoCaixaAtual + totalReforco;
    const totalDinheiro = composicaoTotal - totalCartaoCredito - totalCartaoDebito - totalCartaoPix - totalSangria;
    const dinheiroLiquido = fundoDoCaixaAtual - totalDinheiro;



    const calculoSobra = composicaoTotal > resultadoLiquido ? composicaoTotal - resultadoLiquido : 0;
    const calculoFalta = composicaoTotal < resultadoLiquido ? resultadoLiquido - composicaoTotal : 0;


setEntrada(totalEntrada);
setSaida(totalSaida);
setBruto(resultadoBruto);
setLiquido(resultadoLiquido);
setComposicaoTotal(composicaoTotal);
setSobra(calculoSobra);
setFalta(calculoFalta);
setEntradaTotal(totalEntrada);
setSaidaTotal(totalSaida);
setDespesa(totalDespesas);
setFundoInicial(fundoFiltrado);
setFundoInicial(fundoDoCaixaAtual);
setValorReforco(totalReforco);
setCartaoCredito(totalCartaoCredito);
setCartaoDebito(totalCartaoDebito);
setCartaoPix(totalCartaoPix);
setTotalDinheiro(totalDinheiro);
setTotalSangria(totalSangria);
setDinheiroLiquido(dinheiroLiquido);

    
  }
}, [fecharmaquinas, despesas, sangria, cartao, dinheiro, caixa, composicaoTotal, totalDinheiro, dinheiroLiquido]);



  /*backup
  useEffect(() => {
  const dataHoje = new Date().toISOString().split('T')[0];

  if (fecharmaquinas && despesas && sangria && cartao && dinheiro) {
    const filtroPorUsuarioEData = (arr) =>
      arr.filter((item) =>
        item.usuario === usuarioLogado.nome &&
        (item.data === dataHoje || item.data?.startsWith(dataHoje))
      );

    const totalBruto = filtroPorUsuarioEData(fecharmaquinas).reduce((acc, item) => acc + parseFloat(item.resultado || 0), 0);
    const totalDespesas = filtroPorUsuarioEData(despesas).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const totalSangria = filtroPorUsuarioEData(sangria).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const totalCartao = filtroPorUsuarioEData(cartao).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
    const totalDinheiro = filtroPorUsuarioEData(dinheiro).reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

    const resultadoLiquido = totalBruto - totalDespesas - totalSangria;
    const composicaoTotal = totalCartao + totalDinheiro;

    const calculoSobra = composicaoTotal > resultadoLiquido ? composicaoTotal - resultadoLiquido : 0;
    const calculoFalta = composicaoTotal < resultadoLiquido ? resultadoLiquido - composicaoTotal : 0;

    setBruto(totalBruto);
    setLiquido(resultadoLiquido);
    setComposicao(composicaoTotal);
    setSobra(calculoSobra);
    setFalta(calculoFalta);
  }
}, [fecharmaquinas, despesas, sangria, cartao, dinheiro]);
*/

  // Função para fechar caixa
  const limparDados = async () => {
    const dataHoje = new Date().toISOString().split('T')[0];

    // Salvar histórico
    await fetch('http://localhost:3000/historicocaixa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: usuarioLogado.nome,
        data: dataHoje,
        entrada: totalEntrada,
        saida: totalSaida,
        bruto,
        liquido,
        composicaoTotal,
        sobra,
        falta,
        cartao: cartao.reduce((acc,i)=>acc+parseFloat(i.valor||0),0),
        dinheiro: dinheiro.reduce((acc,i)=>acc+parseFloat(i.valor||0),0),
        fecharmaquinas,
        despesas: totalDespesas,
        sangria: totalSangria,
        fundoInicial,
        reforco: valorReforco,
        dinheiroLiquido,
        

      }),
    });

    // Atualizar status dos caixas abertos para fechado
    if (caixasAbertos && caixasAbertos.length > 0) {
      for (const caixa of caixasAbertos) {
        await fetch(`http://localhost:3000/caixa/${caixa.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'fechado' }),
        });
      }
      // 🔁 Atualiza a lista após o fechamento
        refetchCaixas();
    }

    
    // Apagar os dados auxiliares (como já faz)
    const endpointsParaLimpar = ['fecharmaquinas', 'despesas', 'sangria', 'cartao', 'dinheiro', 'reforco'];
    for (const endpoint of endpointsParaLimpar) {
      const response = await fetch(`http://localhost:3000/${endpoint}`);
      const items = await response.json();
      for (const item of items) {
        await fetch(`http://localhost:3000/${endpoint}/${item.id}`, {
          method: 'DELETE'
        });
      }
    }

    // ✅ Atualiza localStorage ao fechar
const usuarioKey = usuarioLogado?.nome;
localStorage.setItem(`caixaAberto_${usuarioKey}`, 'false');
localStorage.setItem(`caixaFechado_${usuarioKey}`, 'true');

    navigate('/app/home');
  };

  return (
    <div className="containerDespesas">
      <h2>Resumo do Fechamento Final</h2>
      <p><strong>Total de Entrada:</strong> {formatarMoeda(totalEntrada)}</p>
      <p><strong>Total de Saída:</strong> {formatarMoeda(totalSaida)}</p>
      <p><strong>Resultado Bruto:</strong> {formatarMoeda(bruto)}</p>
      <p><strong>Despesas:</strong> {formatarMoeda(totalDespesas)}</p>
      <p><strong>Resultado Líquido:</strong> {formatarMoeda(liquido)}</p>
      <p><strong>Fundo Inicial:</strong> {formatarMoeda(fundoInicial)}</p>
      <p><strong>Reforço:</strong> R$ {formatarMoeda(valorReforco)}</p>
      <p><strong>Extra:</strong> R$ {}</p>
      <p><strong>Composição Total:</strong> R$ {formatarMoeda(composicaoTotal)}</p>
      <p><strong>Débito:</strong> {formatarMoeda(cartaoDebito)}</p>
      <p><strong>Crédito:</strong> {formatarMoeda(cartaoCredito)}</p>
      <p><strong>Pix:</strong> {formatarMoeda(cartaoPix)}</p>
      <p><strong>Dinheiro:</strong> R$ {formatarMoeda(totalDinheiro)} </p>
      <p><strong>Sangria:</strong> R$ {formatarMoeda(totalSangria)} </p>
      <p><strong>Total:</strong> R$ {formatarMoeda(composicaoTotal)}</p>
      <p><strong>Sobra:</strong> R$ {}</p>
      <p><strong>Falta:</strong> R$ {formatarMoeda(falta)}</p>
      <p><strong>Dinheiro Liquido:</strong> R$ {formatarMoeda(dinheiroLiquido)}</p>

      <button onClick={limparDados}>Fechar Caixa</button>
    </div>
  );
}

export default FechamentoFinal;
