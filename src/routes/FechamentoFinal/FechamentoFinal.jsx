import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  // ✅ Corrigido: carregar usuário diretamente no useState
  const [usuarioLogado] = useState(() => {
    const user = localStorage.getItem('usuarioLogado');
    return user ? JSON.parse(user) : null;
  });

  const [fecharmaquinas, setFecharmaquinas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [sangrias, setSangrias] = useState([]);
  const [cartoes, setCartoes] = useState([]);
  const [dinheiro, setDinheiro] = useState([]);
  const [caixas, setCaixas] = useState([]);
  const [reforcos, setReforcos] = useState([]);
  const [caixaAberto, setCaixaAberto] = useState(null);
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
  const [totalFalta, setTotalfalta] = useState(0);

  // 🔄 Buscar caixa aberto após usuário estar definido
  useEffect(() => {
    if (!usuarioLogado) return;

    setCarregando(true); // Coloque aqui para mostrar carregando enquanto busca caixa aberto

    async function buscarCaixaAberto() {
      try {
        const res = await api.get('/caixa', {
          params: {
            status: 'aberto',
            usuario: usuarioLogado.nome,
          },
        });
        setCaixaAberto(res.data[0] || null);
      } catch (error) {
        console.error("Erro ao buscar caixa aberto:", error);
      } finally {
      setCarregando(false); // Só desliga carregando após buscar o caixa
    }
  }

    buscarCaixaAberto();
    console.log('usuarioLogado:', usuarioLogado);
  }, [usuarioLogado]);

  useEffect(() => {
    async function buscarDados() {
      if (!caixaAberto) {
       // setCarregando(false);
        return;
      }
      try {
        const [
          resFecharmaquinas,
          resDespesas,
          resSangria,
          resCartao,
          resDinheiro,
          resCaixa,
          resReforco,
        ] = await Promise.all([
          api.get('/fecharmaquinas', { params: { caixaId: caixaAberto.id } }),
          api.get('/despesas', { params: { caixaId: caixaAberto.id } }),
          api.get('/sangria', { params: { caixaId: caixaAberto.id } }),
          api.get('/cartao', { params: { caixaId: caixaAberto.id } }),
          api.get('/dinheiro', { params: { caixaId: caixaAberto.id } }),
          api.get('/caixa'),
          api.get('/reforco', { params: { caixaId: caixaAberto.id } }),
        ]);

        setFecharmaquinas(resFecharmaquinas.data || []);
        setDespesas(resDespesas.data || []);
        setSangrias(resSangria.data || []);
        setCartoes(resCartao.data || []);
        setDinheiro(resDinheiro.data || []);
        setCaixas(resCaixa.data || []);
        setReforcos(resReforco.data || []);
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      } 
    }
    buscarDados();
    console.log('caixaAberto:', caixaAberto);
  }, [caixaAberto]);

  useEffect(() => {
    if (!caixaAberto || !usuarioLogado) return;

    const filtrarPorCaixaEUsuario = (arr) =>
      arr.filter(
        (item) =>
          item.usuario === usuarioLogado.nome &&
          item.caixaId === caixaAberto.id &&
          item.fechado === 0
      );

    const fecharFiltrado = filtrarPorCaixaEUsuario(fecharmaquinas);
    const despesasFiltradas = filtrarPorCaixaEUsuario(despesas);
    const sangriaFiltrada = filtrarPorCaixaEUsuario(sangrias);
    const cartaoFiltrado = filtrarPorCaixaEUsuario(cartoes);
    const reforcoFiltrado = filtrarPorCaixaEUsuario(reforcos);
    const dinheiroFiltrado = filtrarPorCaixaEUsuario(dinheiro);

    const totalCartaoCredito = cartaoFiltrado
      .filter((i) => i.tipo === 'credito')
      .reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);
    const totalCartaoDebito = cartaoFiltrado
      .filter((i) => i.tipo === 'debito')
      .reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);
    const totalCartaoPix = cartaoFiltrado
      .filter((i) => i.tipo === 'pix')
      .reduce((acc, i) => acc + parseFloat(i.valor || 0), 0);

    const totalReforco = reforcoFiltrado.reduce(
      (acc, i) => acc + parseFloat(i.valor || 0),
      0
    );
    const totalEntrada = fecharFiltrado.reduce(
      (acc, item) =>
        acc +
        parseFloat((item.resultado || '0').toString().replace(',', '.')),
      0
    );

    const totalSaida = fecharFiltrado
      .filter((item) => parseFloat((item.resultado || '0').toString().replace(',', '.')) < 0)
      .reduce(
        (acc, item) =>
          acc +
          Math.abs(parseFloat((item.resultado || '0').toString().replace(',', '.'))),
        0
      );

    const totalDespesasCalc = despesasFiltradas.reduce(
      (acc, i) => acc + parseFloat(i.valor || 0),
      0
    );
    const totalSangriaCalc = sangriaFiltrada.reduce(
      (acc, i) => acc + parseFloat(i.valor || 0),
      0
    );
    const dinheiroTotal = dinheiroFiltrado.reduce(
      (acc, i) => acc + parseFloat(i.valor || 0),
      0
    );

    const resultadoBruto = totalEntrada - totalSaida;
    const resultadoLiquido = resultadoBruto - totalDespesasCalc;
    const fundoDoCaixaAtual = parseFloat(caixaAberto.fundoInicial || 0);
    const composicaoTotalCalc = resultadoLiquido + fundoDoCaixaAtual + totalReforco;

    const totalFalta = composicaoTotalCalc - totalCartaoCredito - totalCartaoDebito - totalCartaoPix - totalSangriaCalc - dinheiroTotal;
    const dinheiroLiquidoCalc = fundoDoCaixaAtual - dinheiroTotal;
    const calculoFalta = composicaoTotalCalc < resultadoLiquido ? resultadoLiquido - composicaoTotalCalc : 0;

    // Setar estados finais
    setTotalDinheiro(dinheiroTotal);
    setTotalfalta(totalFalta);
    setEntrada(totalEntrada);
    setSaida(totalSaida);
    setBruto(resultadoBruto);
    setLiquido(resultadoLiquido);
    setComposicaoTotal(composicaoTotalCalc);
    setFalta(calculoFalta);
    setDespesa(totalDespesasCalc);
    setFundoInicial(fundoDoCaixaAtual);
    setValorReforco(totalReforco);
    setCartaoCredito(totalCartaoCredito);

    setCartaoDebito(totalCartaoDebito);
    setCartaoPix(totalCartaoPix);
    setTotalSangria(totalSangriaCalc);
    setDinheiroLiquido(dinheiroLiquidoCalc);
  }, [
    fecharmaquinas,
    despesas,
    sangrias,
    cartoes,
    reforcos,
    caixas,
    dinheiro,
    caixaAberto,
    usuarioLogado
  ]);

  const limparDados = async () => {
    if (!caixaAberto) {
      alert('Nenhum caixa aberto para fechar.');
      return;
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    try {
      await api.post('/historicocaixa', {
        usuario: usuarioLogado.nome,
        data: dataHoje,
        caixaId: caixaAberto.id,
        entrada,
        saida,
        bruto,
        liquido,
        composicaoTotal,
        sobra,
        totalFalta,
        cartao: cartoes.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0),
        dinheiro: dinheiro.reduce((acc, i) => acc + parseFloat(i.valor || 0), 0),
        fecharmaquinas,
        despesas: totalDespesas,
        sangria: totalSangria,
        fundoInicial,
        reforco: valorReforco,
        dinheiroLiquido,
      });

      await api.patch(`/caixa/${caixaAberto.id}`, { status: 'fechado' });

      const endpoints = ['fecharmaquinas', 'despesas', 'sangria', 'cartao', 'dinheiro', 'reforco'];
      for (const endpoint of endpoints) {
        const res = await api.get(`/${endpoint}`, { params: { caixaId: caixaAberto.id } });
        for (const item of res.data) {
          if (!item.fechado && item.usuario === usuarioLogado.nome) {
            await api.patch(`/${endpoint}/${item.id}`, { fechado: true });
          }
        }
      }

      const maquinasRes = await api.get('/maquinas');
      const maquinasDaLoja = maquinasRes.data.filter(m => m.loja === caixaAberto.loja);

      const fecharMaquinasRes = await api.get('/fecharmaquinas', {
        params: { caixaId: caixaAberto.id },
      });

      for (const maquina of maquinasDaLoja) {
        const fechamento = fecharMaquinasRes.data.find((f) =>
          parseInt(f.maquinaId) === parseInt(maquina.id) &&
          f.usuario.trim().toLowerCase() === usuarioLogado.nome.trim().toLowerCase() &&
          (f.fechado === 1 || f.fechado === '1')
        );

        if (!fechamento) continue;

        const entradaFinal = parseFloat(fechamento.entradaFinal || 0);
  const saidaFinal = parseFloat(fechamento.saidaFinal || 0);

  const entradaAtual = parseFloat(maquina.inicial || 0);
  const saidaAtual = parseFloat(maquina.final || 0);

  const diferencaEntrada = entradaFinal - entradaAtual;
  const diferencaSaida = saidaFinal - saidaAtual;

  await api.put(`/maquinas/${maquina.id}`, {
    inicial: entradaAtual + diferencaEntrada,
    final: saidaAtual + diferencaSaida,
  });
}

      alert('Caixa fechado com sucesso!');
      navigate('/app/home');
    } catch (error) {
      console.error('Erro ao fechar caixa:', error);
      alert('Erro ao fechar caixa, veja o console.');
    }
  };

  if (carregando) return <div>Carregando...</div>;

  if (!caixaAberto) {
    return (
      <div className="fechamento-final-container">
        <h2>Nenhum caixa aberto encontrado para o usuário.</h2>
        <Link to="/app/home">Voltar</Link>
      </div>
    );
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
      <p><strong>Dinheiro:</strong> {formatarMoeda(totalDinheiro)}</p>
      <p><strong>Crédito:</strong> {formatarMoeda(cartaoCredito)}</p>
      <p><strong>Débito:</strong> {formatarMoeda(cartaoDebito)}</p>
      <p><strong>Pix:</strong> {formatarMoeda(cartaoPix)}</p>
      <p><strong>Sangria:</strong> {formatarMoeda(totalSangria)}</p>
      <p><strong>Total:</strong> {formatarMoeda(composicaoTotal)}</p>
      <p><strong>Sobra:</strong> {formatarMoeda(sobra)}</p>
      <p><strong>Falta:</strong> {formatarMoeda(totalFalta)}</p>
      <p><strong>Reposição:</strong> {formatarMoeda(dinheiroLiquido)}</p>

      <button onClick={limparDados}>Fechar Caixa</button>
      <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
    </div>
  );
}

export default FechamentoFinal;
