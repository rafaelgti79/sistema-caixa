import React, { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useNavigate } from 'react-router-dom';


const url = "http://localhost:3000/fecharmaquinas";




function FechamentoMaquinas() {
  const [maquina, setMaquina] = useState('');
  const [entradaInicial, setEntradaInicial] = useState('');
  const [entradaFinal, setEntradaFinal] = useState('');
  const [saidaInicial, setSaidaInicial] = useState('');
  const [saidaFinal, setSaidaFinal] = useState('');
  const [resultado, setResultado] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

const { data: caixas } = useFetch("http://localhost:3000/caixa");
   const { data: maquinas, } = useFetch('http://localhost:3000/maquinas');
   const { data: items, httpConfig, updateData } = useFetch(url);
   const navigate = useNavigate();

   useEffect(() => {
  if (maquinas && currentIndex < maquinas.length) {
    const maquinaAtual = maquinas[currentIndex];
    const valorJogo = parseFloat(maquinaAtual.valorJogo);

    const entradaIni = parseFloat(entradaFinal);
    const entradaFin = parseFloat(saidaFinal);

    if (!isNaN(entradaIni) && !isNaN(entradaFin) && !isNaN(valorJogo)) {
      const calculo = (entradaFin - entradaIni) * valorJogo;
      setResultado(calculo.toFixed(2)); // resultado formatado com 2 casas decimais
    } else {
      setResultado('');
    }
  }
}, [entradaFinal, saidaFinal, maquinas, currentIndex]);

     
   const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

   useEffect(() => {
    if (maquinas && currentIndex < maquinas.length) {
      const maquinaAtual = maquinas[currentIndex];
      setEntradaInicial(maquinaAtual.entradaAtual || '');
      setSaidaInicial(maquinaAtual.saidaAtual || '');
    }
  }, [currentIndex, maquinas]);


    useEffect(() => {
  if (maquinas && currentIndex >= maquinas.length) {
    // Redireciona direto para a página de fechamento final
    navigate('/app/fechamento/final');
  }
}, [currentIndex, maquinas, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

     if (!maquinas || maquinas.length === 0) return;

     const maquinaAtual = maquinas[currentIndex];
     const valorResultado = parseFloat(resultado);


     const fecharmaquinas = {

      maquinaId: maquinaAtual.id,
      maquina: maquinaAtual.jogo || maquinaAtual.numeroMaquina || maquinaAtual.id, // ajuste conforme seu JSON,
      entradaInicial,
      entradaFinal,
      saidaInicial,
      saidaFinal,
      resultado,
       usuario: usuarioLogado.nome,
       usuarioId: usuarioLogado.id || null, // caso você use um id de usuário
       dataHora: new Date().toISOString()   // opcional: para registrar data/hora do fechamento
    };
    httpConfig(fecharmaquinas, "POST");
    
    // Atualiza o caixa do dia com o resultado
  if (caixas && valorResultado && !isNaN(valorResultado)) {
  const dataHoje = new Date().toISOString().split('T')[0];

  const caixaAtual = caixas.find(caixa =>
    caixa.usuario === usuarioLogado.nome &&
    caixa.loja === maquinaAtual.loja &&
    caixa.data === dataHoje
  );

  if (caixaAtual) {
    const fechamentoAtual = parseFloat(caixaAtual.fechamento || 0);
    const totalEntradaAtual = parseFloat(caixaAtual.totalEntrada || 0);

    const novoFechamento = fechamentoAtual + valorResultado;
    const novaEntrada = totalEntradaAtual + valorResultado;

    updateData({
      ...caixaAtual,
      fechamento: novoFechamento,
      totalEntrada: novaEntrada
    }, "PUT", caixaAtual.id);
  }
}


   // Limpar campos e avançar para a próxima máquina
    setEntradaInicial('');
    setEntradaFinal('');
    setSaidaInicial('');
    setSaidaFinal('');
    setResultado('');
    setCurrentIndex(prev => prev + 1);
  };

  if (!maquinas || maquinas.length === 0) {
    return <div className="containerDespesas"><h2>Carregando máquinas...</h2></div>;
  }

  if (currentIndex >= maquinas.length) {
    return <div className="containerDespesas"><h2>Fechamento concluído! Redirecionando...</h2></div>;
  }

  const maquinaAtual = maquinas[currentIndex];

  return (
    <div className="containerDespesas">
      <h1>FECHAMENTO MAQUINA</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>Máquina Atual:</label>
          <input type="text" value={maquinaAtual.jogo || maquinaAtual.numero || maquinaAtual.id} readOnly />

           <label>INICIAL:</label>
            <input type="text" value={entradaInicial} onChange={(event) => setEntradaInicial(event.target.value)} />

            <label>ENTRADA INICIAL:</label>
            <input type="text" value={entradaFinal} onChange={(event) => setEntradaFinal(event.target.value)} />

             <label>FINAL:</label>
            <input type="text" value={saidaInicial} onChange={(event) => setSaidaInicial(event.target.value)} />

            <label>ENTRADA FINAL:</label>
            <input type="text" value={saidaFinal} onChange={(event) => setSaidaFinal(event.target.value)} />
            

            <label>RESULTADO:</label>
            <input type="text" value={resultado} onChange={(event) => setResultado(event.target.value)} />

           
          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default FechamentoMaquinas;
            
          
       

        
