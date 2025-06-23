import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

function FechamentoFinal() {
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const { data: fecharmaquinas } = useFetch('http://localhost:3000/fecharmaquinas');
  const { data: despesas } = useFetch('http://localhost:3000/despesas');
  const { data: sangria } = useFetch('http://localhost:3000/sangria');
  const { data: cartao } = useFetch('http://localhost:3000/cartao');
  const { data: dinheiro } = useFetch('http://localhost:3000/dinheiro');

  // Busca caixas abertos do usuário
const { data: caixasAbertos, refetch: refetchCaixas } = useFetch(
  `http://localhost:3000/caixa?status=aberto&usuario=${usuarioLogado.nome}`
);
  const [bruto, setBruto] = useState(0);
  const [liquido, setLiquido] = useState(0);
  const [composicao, setComposicao] = useState(0);
  const [sobra, setSobra] = useState(0);
  const [falta, setFalta] = useState(0);

  // Calcula totais e atualiza estados
  useEffect(() => {
    if (fecharmaquinas && despesas && sangria && cartao && dinheiro) {
      const totalBruto = fecharmaquinas.reduce((acc, item) => acc + parseFloat(item.resultado || 0), 0);
      const totalDespesas = despesas.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
      const totalSangria = sangria.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
      const totalCartao = cartao.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);
      const totalDinheiro = dinheiro.reduce((acc, item) => acc + parseFloat(item.valor || 0), 0);

      const resultadoLiquido = totalBruto - totalDespesas - totalSangria;
      const composicaoTotal = totalCartao + totalDinheiro;

      const calculoSobra = composicaoTotal > resultadoLiquido ? composicaoTotal - resultadoLiquido : 0;
      const calculoFalta = composicaoTotal < resultadoLiquido ? resultadoLiquido - composicaoTotal : 0;

      setBruto(totalBruto);
      setLiquido(resultadoLiquido);
      setComposicao(composicaoTotal);
      setSobra(calculoSobra);
      setFalta(calculoFalta);

      // Salvar resultados (como você já faz)
    }
  }, [fecharmaquinas, despesas, sangria, cartao, dinheiro]);

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
        bruto,
        liquido,
        composicao,
        sobra,
        falta,
        cartao,
        dinheiro,
        fecharmaquinas,
        despesas,
        sangria,
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

    /*
    // Apagar os dados auxiliares (como já faz)
    const endpointsParaLimpar = ['fecharmaquinas', 'despesas', 'sangria', 'cartao', 'dinheiro'];
    for (const endpoint of endpointsParaLimpar) {
      const response = await fetch(`http://localhost:3000/${endpoint}`);
      const items = await response.json();
      for (const item of items) {
        await fetch(`http://localhost:3000/${endpoint}/${item.id}`, {
          method: 'DELETE'
        });
      }
    }
*/
    // ✅ Atualiza localStorage ao fechar
const usuarioKey = usuarioLogado?.nome;
localStorage.setItem(`caixaAberto_${usuarioKey}`, 'false');
localStorage.setItem(`caixaFechado_${usuarioKey}`, 'true');

    navigate('/app/home');
  };

  return (
    <div className="containerDespesas">
      <h2>Resumo do Fechamento Final</h2>
      <p><strong>Resultado Bruto:</strong> R$ {bruto.toFixed(2)}</p>
      <p><strong>Resultado Líquido:</strong> R$ {liquido.toFixed(2)}</p>
      <p><strong>Composição Total:</strong> R$ {composicao.toFixed(2)}</p>
      <p><strong>Sobra:</strong> R$ {sobra.toFixed(2)}</p>
      <p><strong>Falta:</strong> R$ {falta.toFixed(2)}</p>

      <button onClick={limparDados}>Fechar Caixa</button>
    </div>
  );
}

export default FechamentoFinal;
