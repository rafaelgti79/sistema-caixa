import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js'; // Certifique-se que está importando corretamente
import { Link, useNavigate } from 'react-router-dom';
import './fechamentoMaquinas.css';

function FechamentoMaquinas() {
  const [maquina, setMaquina] = useState('');
  const [inicial, setInicial] = useState('');
  const [final, setFinal] = useState('');
  const [saidaInicial, setSaidaInicial] = useState('');
  const [entradaFinal, setEntradaFinal] = useState('');
  const [saidaFinal, setSaidaFinal] = useState('');
  const [resultado, setResultado] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const [caixas, setCaixas] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // Carregar máquinas e caixas
  useEffect(() => {
    async function fetchData() {
      try {
        const [maquinasRes, caixasRes] = await Promise.all([
          api.get('/maquinas'),
          api.get('/caixa')
        ]);
        setMaquinas(maquinasRes.data);
        setCaixas(caixasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);

  // Preencher campos quando a máquina atual muda
  useEffect(() => {
    if (maquinas && currentIndex < maquinas.length) {
      const maquinaAtual = maquinas[currentIndex];
      setInicial(maquinaAtual.entradaAtual || '');
      setFinal(maquinaAtual.saidaAtual || '');
    }
  }, [currentIndex, maquinas]);

 

   useEffect(() => {
  if (maquinas && currentIndex < maquinas.length) {
    const maquinaAtual = maquinas[currentIndex];
    
    const valorJogo = parseFloat(maquinaAtual.valorJogo);

    const entradaIni = parseFloat(maquinaAtual.inicial);  // E.I
    const entradaFin = parseFloat(saidaFinal);            // E.F

    const saidaIni = parseFloat(maquinaAtual.final);      // S.I
    const saidaFin = parseFloat(saidaInicial);            // S.F

    if (
      !isNaN(valorJogo) &&
      !isNaN(entradaIni) && !isNaN(entradaFin) &&
      !isNaN(saidaIni) && !isNaN(saidaFin)
    ) {
      const entradaTotal = (entradaFin - entradaIni) * valorJogo;
      const saidaTotal = (saidaFin - saidaIni) * valorJogo;
      const resultadoFinal = entradaTotal - saidaTotal;

      setResultado(resultadoFinal.toFixed(2));
    } else {
      setResultado('');
    }
  }
}, [saidaInicial, saidaFinal, maquinas, currentIndex]);



  useEffect(() => {
  if (!maquinas || maquinas.length === 0) return;
  if (currentIndex >= maquinas.length) {
    navigate('/app/fechamento/final');
  }
}, [currentIndex, maquinas, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!maquinas || maquinas.length === 0) return;

    const maquinaAtual = maquinas[currentIndex];
    const valorResultado = parseFloat(resultado);

    const fecharmaquinas = {
      maquinaId: maquinaAtual.id,
      maquina: maquinaAtual.numeroMaquina || maquinaAtual.jogo || maquinaAtual.id || maquinaAtual.inicial || maquinaAtual.final,
      saidaInicial,
      saidaFinal,
      resultado,
      usuario: usuarioLogado.nome,
      usuarioId: usuarioLogado.id || null,
      dataHora: new Date().toISOString()
    };

    console.log({
  maquinaId: maquinaAtual.id,
  maquina: maquinaAtual.numeroMaquina || maquinaAtual.jogo || maquinaAtual.id || maquinaAtual.inicial || maquinaAtual.final,
  saidaInicial,
  saidaFinal,
  resultado,
  usuario: usuarioLogado.nome,
  usuarioId: usuarioLogado.id || null,
  dataHora: new Date().toISOString()
});


    try {
      await api.post('/fecharmaquinas', fecharmaquinas);

      const dataHoje = new Date().toISOString().split('T')[0];

      const caixaAtual = caixas.find(caixa =>
        caixa.usuario === usuarioLogado.nome &&
        caixa.loja === maquinaAtual.loja &&
        caixa.data === dataHoje
      );

      if (caixaAtual && valorResultado && !isNaN(valorResultado)) {
        const fechamentoAtual = parseFloat(caixaAtual.fechamento || 0);
        const totalEntradaAtual = parseFloat(caixaAtual.totalEntrada || 0);

        const novoFechamento = fechamentoAtual + valorResultado;
        const novaEntrada = totalEntradaAtual + valorResultado;

        await api.put(`/caixa/${caixaAtual.id}`, {
          ...caixaAtual,
          fechamento: novoFechamento,
          totalEntrada: novaEntrada
        });
      }

      // Limpa os campos e avança para a próxima máquina
      setInicial('');
      setFinal('');
      setSaidaInicial('');
      setSaidaFinal('');
      setResultado('');
      setEntradaFinal('');
      if (currentIndex + 1 >= maquinas.length) {
      navigate('/app/fechamento/final');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
    } catch (error) {
      console.error("Erro ao salvar fechamento:", error);
    }
  };

  if (!maquinas || maquinas.length === 0) {
    return <div className="containerDespesas"><h2>Carregando máquinas...</h2></div>;
  }

  if (currentIndex >= maquinas.length) {
    return <div className="containerDespesas"><h2>Fechamento concluído! Redirecionando...</h2></div>;
  }

  const maquinaAtual = maquinas[currentIndex];

return (
<div className="containerFechamento3">

  <form onSubmit={handleSubmit}>


  <div className="subcontainer3">
   <div className="form-row1">
    <label className='labelnumero'>Nº:</label>
    <input className='inputNumero' type="number" value={maquinaAtual.numeroMaquina || maquinaAtual.jogo || maquinaAtual.id} readOnly />
    <span className="jogo-nome">{maquinaAtual.jogo}</span>
   </div>

  <div className="form-row1">
    <label className='label4'>E.I:</label>
    <input className='input4' type="text" value={maquinaAtual.inicial} onChange={(event) => setInicial(event.target.value)} />
  </div>

  <div className="form-row1">
    <label className='label4'>E.F:</label>
    <input className='input4' type="text" value={saidaFinal} onChange={(event) => setSaidaFinal(event.target.value)} />
  </div>

  <div className="form-row1">
    <label className='label4'>S.I:</label>
    <input className='input4' type="text" value={maquinaAtual.final} onChange={(event) => setFinal(event.target.value)} />
  </div>

  <div className="form-row1">
    <label className='label4'>S.F:</label>
    <input className='input4' type="text" value={saidaInicial} onChange={(event) => setSaidaInicial(event.target.value)} />
  </div>

  <div className="form-row1">
    <label className='label4'>RES:</label>
    <input className='input4' type="text" value={resultado} onChange={(event) => setResultado(event.target.value)} />
  </div>
</div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
export default FechamentoMaquinas;
            
          
       

        
