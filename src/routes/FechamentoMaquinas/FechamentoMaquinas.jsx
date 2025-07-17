import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js'; // Certifique-se que está importando corretamente
import { Link, useNavigate } from 'react-router-dom';
import './fechamentoMaquinas.css';

function FechamentoMaquinas() {
  
  const [inicial, setInicial] = useState('');
  const [final, setFinal] = useState('');
  const [saidaFinal, setSaidaFinal] = useState('');
  const [entradaFinal, setEntradaFinal] = useState('');
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
          api.get('/caixa'),
        ]);
        setMaquinas(maquinasRes.data);
        setCaixas(caixasRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
    fetchData();
  }, []);
        

  
useEffect(() => {
  if (maquinas && currentIndex < maquinas.length) {
    const maquinaAtual = maquinas[currentIndex];
    const dataHoje = new Date().toISOString().split('T')[0];
 


   async function buscarFechamentoAnterior() {
  try {
    const res = await api.get('/fecharmaquinas');
    const dataHoje = new Date().toISOString().split('T')[0];

    // Verifica se já existe fechamento feito hoje para a máquina
    const registrosDoDia = res.data.filter(item =>
      item.usuario === usuarioLogado.nome &&
      item.maquinaId === maquinaAtual.id &&
      item.fechado === 0 // só pega registros em aberto
    );

    if (registrosDoDia.length > 0) {
      const dado = registrosDoDia[0];
      setSaidaFinal(dado.saidaFinal || '');
      setEntradaFinal(dado.entradaFinal || '');
      setResultado(dado.resultado || '');

    } else {
      // Limpa tudo se não houver registros válidos
      setSaidaFinal('');
      setEntradaFinal('');
      setResultado('');
    }
  } catch (err) {
    console.error("Erro ao buscar fechamento anterior:", err);
  }
}
buscarFechamentoAnterior();
setInicial(maquinaAtual.entradaAtual || '');
setFinal(maquinaAtual.saidaAtual || '');
}
}, [currentIndex, maquinas, usuarioLogado.nome]);
      



useEffect(() => {
if (maquinas && currentIndex < maquinas.length) {
 const maquinaAtual = maquinas[currentIndex];
 
 const valorJogo = parseFloat(maquinaAtual.valor);

 const entradaIni = parseFloat(maquinaAtual.inicial);  // E.I
 const entradaFin = parseFloat(entradaFinal);            // E.F

 const saidaIni = parseFloat(maquinaAtual.final);      // S.I
 const saidaFin = parseFloat(saidaFinal);            // S.F

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
}, [saidaFinal, entradaFinal, maquinas, currentIndex]);
 




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

  //buscar caixa atual aberto
   let caixaAtual;
  try {
    const caixasRes = await api.get('/caixa', {
      params: {
        usuario: usuarioLogado.nome,
        loja: maquinaAtual.loja,
        status: 'aberto'
      }
    });

    caixaAtual = caixasRes.data[0]; // Pega o primeiro caixa encontrado
  } catch (err) {
    console.error("Erro ao buscar caixa aberto:", err);
    alert("Erro ao buscar caixa. Tente novamente.");
    return;
  }


  if (!caixaAtual) {
    alert('Nenhum caixa aberto encontrado para essa loja e usuário. Por favor, abra um caixa antes de fechar a máquina.');
    return;
  }

  const fecharmaquinas = {
    maquinaId: maquinaAtual.id,
    maquina: maquinaAtual.numeroMaquina || maquinaAtual.jogo || maquinaAtual.id,
   // saidaFinal: parseFloat(saidaFinal),
    //entradaFinal: parseFloat(entradaFinal),
    resultado: parseFloat(resultado),
    usuario: usuarioLogado.nome,
    usuarioId: usuarioLogado.id || null,
    dataHora: new Date().toISOString(),
    caixaId: caixaAtual.id,  // <-- adiciona o caixaId aqui
  };

  // Só adiciona entradaFinal se for número válido
if (!isNaN(parseFloat(entradaFinal)) && entradaFinal !== '') {
  fecharmaquinas.entradaFinal = parseFloat(entradaFinal);
}

// Só adiciona saidaFinal se for número válido
if (!isNaN(parseFloat(saidaFinal)) && saidaFinal !== '') {
  fecharmaquinas.saidaFinal = parseFloat(saidaFinal);
}

  try {
    const dataHoje = new Date().toISOString().split('T')[0];
    
    const resFechamentos = await api.get('/fecharmaquinas');
    const existente = resFechamentos.data.find(item =>
      item.usuario === usuarioLogado.nome &&
      item.maquinaId === maquinaAtual.id &&
      item.dataHora.startsWith(dataHoje)
    );

    if (existente) {
      await api.patch(`/fecharmaquinas/atualizar/${existente.id}`, fecharmaquinas);
    } else {
      await api.post('/fecharmaquinas', fecharmaquinas);
    }

    if (valorResultado && !isNaN(valorResultado)) {
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
    setSaidaFinal('');
    setEntradaFinal('');
    setResultado('');
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
    <input className='input4' type="text" value={entradaFinal} onChange={(event) => setEntradaFinal(event.target.value)} />
  </div>

  <div className="form-row1">
    <label className='label4'>S.I:</label>
    <input className='input4' type="text" value={maquinaAtual.final} onChange={(event) => setFinal(event.target.value)} />
  </div>

  <div className="form-row1">
    <label className='label4'>S.F:</label>
    <input className='input4' type="text" value={saidaFinal} onChange={(event) => setSaidaFinal(event.target.value)} />
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
        <div className="navegacao-maquinas">
  <button
    type="button"
    onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
    disabled={currentIndex === 0}
  >
    ⬅ 
  </button>

  <span>{currentIndex + 1} de {maquinas.length}</span>

  <button
    type="button"
    onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, maquinas.length - 1))}
    disabled={currentIndex >= maquinas.length - 1}
  >
     ➡
  </button>
</div>

<div className="ir-para-maquina">
  <label>Ir para máquina nº:</label>
  <input
    type="number"
    onChange={(e) => {
      const numero = parseInt(e.target.value);
      const indexEncontrado = maquinas.findIndex(
        (m) => parseInt(m.numeroMaquina) === numero
      );
      if (indexEncontrado !== -1) {
        setCurrentIndex(indexEncontrado);
      }
    }}
    placeholder="Digite o número"
  />
</div>

      </form>
    </div>
  );
}
export default FechamentoMaquinas;


            
          
       

        
