import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api.js';
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

  const [fecharmaquinas, setFecharmaquinas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [sangrias, setSangrias] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [dinheiro, setDinheiro] = useState([]);
  const [caixas, setCaixas] = useState([]);
  const [reforcos, setReforcos] = useState([]);
  const [caixasAbertos, setCaixasAbertos] = useState([]);
  const [carregando, setCarregando] = useState(true);


  const [entrada, setEntrada] = useState(0);
  const [saida, setSaida] = useState(0);
  const [bruto, setBruto] = useState(0);
  const [liquido, setLiquido] = useState(0);
  const [composicaoTotal, setComposicaoTotal] = useState(0);
  const [sobra, setSobra] = useState(0);
  const [falta, setFalta] = useState(0);
  const [totalDespesas, setDespesa] = useState(0);
  const [fundoInicial, setFundoInicial] = useState(0);
  const [valorReforco, setValorReforco] = useState(0);
  const [cartaoCredito, setCartaoCredito] = useState(0);
  const [cartaoDebito, setCartaoDebito] = useState(0);
  const [cartaoPix, setCartaoPix] = useState(0);
  const [totalDinheiro, setTotalDinheiro] = useState(0);
  const [totalSangria, setTotalSangria] = useState(0);
  const [dinheiroLiquido, setDinheiroLiquido] = useState(0);
  


  // Carrega dados ao montar
  useEffect(() => {
    async function buscarDados() {
      try {
        const [
          resFecharmaquinas,
          resDespesas,
          resSangria,
          resCartao,
          resDinheiro,
          resCaixa,
          resReforco,
          resCaixasAbertos
        ] = await Promise.all([
          api.get('/fecharmaquinas'),
          api.get('/despesas'),
          api.get('/sangria'),
          api.get('/cartao'),
          api.get('/dinheiro'),
          api.get('/caixa'),
          api.get('/reforco'),
          api.get(`/caixa?status=aberto&usuario=${usuarioLogado.nome}`),
        ]);

        setFecharmaquinas(resFecharmaquinas.data || []);
        setDespesas(resDespesas.data || []);
        setSangrias(resSangria.data || []);
        setCartoes(resCartao.data || []);
        setDinheiro(resDinheiro.data || []);
        setCaixas(resCaixa.data || []);
        setReforcos(resReforco.data || []);
        setCaixasAbertos(resCaixasAbertos.data || []);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Erro ao buscar dados. Verifique sua conexão ou contate o suporte.");
      } finally {
      setCarregando(false);
    }
  }

  buscarDados();
}, [usuarioLogado.nome]);

  // Cálculos
  useEffect(() => {
    const dataHoje = new Date().toISOString().split('T')[0];

    const filtrarPorDataEUsuario = (arr, campoData = 'dataHora') =>
      arr.filter(item => 
        item.usuario === usuarioLogado.nome && 
        item[campoData]?.startsWith(dataHoje) &&
        !item.fechado // 👈 NOVO: apenas não fechados
      );
        

    const fecharFiltrado = filtrarPorDataEUsuario(fecharmaquinas);
    const despesasFiltradas = filtrarPorDataEUsuario(despesas, 'data');
    const sangriaFiltrada = filtrarPorDataEUsuario(sangrias, 'data');
    const cartaoFiltrado = filtrarPorDataEUsuario(cartoes, 'data');
    const reforcoFiltrado = filtrarPorDataEUsuario(reforcos, 'data');
    


    const totalCartaoCredito = cartaoFiltrado.filter(i => i.tipo === 'credito').reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);
    const totalCartaoDebito = cartaoFiltrado.filter(i => i.tipo === 'debito').reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);
    const totalCartaoPix = cartaoFiltrado.filter(i => i.tipo === 'pix').reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);

    const totalReforco = reforcoFiltrado.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);

    const totalEntrada = fecharFiltrado.reduce((acc, item) => acc + parseFloat((item.resultado || "0").toString().replace(',', '.')), 0);

    const totalSaida = fecharFiltrado
      .filter(item => parseFloat((item.resultado || "0").toString().replace(',', '.')) < 0)
      .reduce((acc, item) => acc + Math.abs(parseFloat((item.resultado || "0").toString().replace(',', '.'))), 0);

    const totalDespesas = despesasFiltradas.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);
    const totalSangria = sangriaFiltrada.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);

   

    const resultadoBruto = totalEntrada - totalSaida;
    const resultadoLiquido = resultadoBruto - totalDespesas;

    const caixaAbertoAtual = caixasAbertos.length ? caixasAbertos[0] : null;
    const fundoDoCaixaAtual = caixaAbertoAtual ? parseFloat(caixaAbertoAtual.fundoInicial || 0) : 0;

    const composicaoTotal = resultadoLiquido + fundoDoCaixaAtual + totalReforco;
    const totalDinheiroCalculado = falta - dinheiro;

    const dinheiroLiquido = fundoDoCaixaAtual - totalDinheiroCalculado;
    //const calculoSobra = composicaoTotal > resultadoLiquido ? composicaoTotal - resultadoLiquido : 0;
    const calculoFalta = composicaoTotal < resultadoLiquido ? resultadoLiquido - composicaoTotal : 0;

    setEntrada(totalEntrada);
    setSaida(totalSaida);
    setBruto(resultadoBruto);
    setLiquido(resultadoLiquido);
    setComposicaoTotal(composicaoTotal);
    //setSobra(calculoSobra);
    setFalta(calculoFalta);
    setDespesa(totalDespesas);
    setFundoInicial(fundoDoCaixaAtual);
    setValorReforco(totalReforco);
    setCartaoCredito(totalCartaoCredito);
    setCartaoDebito(totalCartaoDebito);
    setCartaoPix(totalCartaoPix);
    setTotalDinheiro(totalDinheiroCalculado);
    setTotalSangria(totalSangria);
    setDinheiroLiquido(dinheiroLiquido);
    
  }, [fecharmaquinas, despesas, sangrias, cartoes, reforcos, caixasAbertos]);

  // Função fechar caixa
  const limparDados = async () => {
  const dataHoje = new Date().toISOString().split('T')[0];

  // 1. Salva o histórico do caixa
  await api.post('/historicocaixa', {
    usuario: usuarioLogado.nome,
    data: dataHoje,
    entrada,
    saida,
    bruto,
    liquido,
    composicaoTotal,
    sobra,
    falta,
    cartao: cartoes.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0),
    dinheiro: dinheiro.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0),
    fecharmaquinas,
    despesas: totalDespesas,
    sangria: totalSangria,
    fundoInicial,
    reforco: valorReforco,
    dinheiroLiquido
  });

  // 2. Fecha os caixas abertos do usuário
  for (const caixa of caixasAbertos) {
    await api.patch(`/caixa/${caixa.id}`, { status: 'fechado' });
  }

  // 3. Lista de endpoints a marcar como fechados
  const endpoints = ['fecharmaquinas', 'despesas', 'sangria', 'cartao', 'dinheiro', 'reforco'];

  for (const endpoint of endpoints) {
    const res = await api.get(`/${endpoint}`);

    for (const item of res.data) {
      // Marca todos como fechado: true
      await api.patch(`/${endpoint}/${item.id}`, { fechado: true });
    }
  }

  navigate('/app/home');
};


if (carregando) {
  return <p>Carregando dados do fechamento...</p>;
}
  return (
    <div className="containerDespesas">
      <h2>Resumo do Fechamento Final</h2>
      <p><strong>Total de Entrada:</strong> {formatarMoeda(entrada)}</p>
      <p><strong>Total de Saída:</strong> {formatarMoeda(saida)}</p>
      <p><strong>Resultado Bruto:</strong> {formatarMoeda(bruto)}</p>
      <p><strong>Despesas:</strong> {formatarMoeda(totalDespesas)}</p>
      <p><strong>Resultado Líquido:</strong> {formatarMoeda(liquido)}</p>
      <p><strong>Fundo Inicial:</strong> {formatarMoeda(fundoInicial)}</p>
      <p><strong>Reforço:</strong> {formatarMoeda(valorReforco)}</p>
      <p><strong>Composição Total:</strong> {formatarMoeda(composicaoTotal)}</p>
      <p><strong>Dinheiro:</strong> {formatarMoeda(dinheiro)}</p>
      <p><strong>Crédito:</strong> {formatarMoeda(cartaoCredito)}</p>
      <p><strong>Débito:</strong> {formatarMoeda(cartaoDebito)}</p>
      <p><strong>Pix:</strong> {formatarMoeda(cartaoPix)}</p>
      <p><strong>Total:</strong> {}</p>
      <p><strong>Sangria:</strong> {formatarMoeda(totalSangria)}</p>
      <p><strong>Sobra:</strong> {formatarMoeda(sobra)}</p>
      <p><strong>Falta:</strong> {}</p>
      <p><strong>Reposição:</strong> {formatarMoeda(dinheiroLiquido)}</p>

      <button onClick={limparDados}>Fechar Caixa</button>
    </div>
  );
}

export default FechamentoFinal;
