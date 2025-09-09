import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api.js';
import './AbrirCaixa.css';

function AbrirCaixa() {
  const [loja, setLoja] = useState('MAX');
  const [fundoInicial, setFundoInicial] = useState('');
  const [data, setData] = useState('');
  const [setor, setSetor] = useState('setor1');
  const [lojas, setLojas] = useState([]);
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    // Obtém a data atual no formato yyyy-mm-dd
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0];
    setData(dataFormatada);
  }, []);

  // ✅ Verifica status do caixa via API
  useEffect(() => {
    async function verificarCaixaAberto() {
      try {
        const res = await api.get(`/caixa/status?usuario=${usuarioLogado.nome}`);
        if (res.data.status === 'aberto') {
          navigate('/app/home-caixa');
        }
      } catch (err) {
        console.error('Erro ao verificar status do caixa:', err);
      }
    }
    if (usuarioLogado) {
      verificarCaixaAberto();
    }
  }, [navigate, usuarioLogado]);

  // 🏬 Buscar lojas
  useEffect(() => {
    async function fetchLojas() {
      try {
        const res = await api.get('/lojas');
        setLojas(res.data);
      } catch (err) {
        console.error('Erro ao buscar lojas:', err);
      }
    }
    fetchLojas();
  }, []);

  // 📤 Envio de dados
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!fundoInicial || !loja) {
      return alert("Preencha todos os campos obrigatórios.");
    }

    // Verifica se já existe um caixa aberto na loja
    try {
      const resCaixaAberto = await api.get(`/caixa/aberto?loja=${loja}`);
      if (resCaixaAberto.data.status === 'aberto') {
        return alert(`Já existe um caixa aberto para a loja ${loja}.`);
      }
    } catch (err) {
      console.error('Erro ao verificar caixa aberto na loja:', err);
      alert('Erro ao verificar caixa aberto.');
      return;
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    const caixa = {
      fundoInicial: parseFloat(fundoInicial),
      data: dataHoje,
      setor,
      loja,
      usuario: usuarioLogado.nome,
      status: 'aberto'
    };

    try {
      // 1. Cria o caixa e guarda a resposta
      const resCaixa = await api.post('/caixa', caixa);
      const novoCaixa = resCaixa.data; // agora temos o ID

      // 2. Busca todas as máquinas da loja atual
      const resMaquinas = await api.get('/maquinas');
      const maquinasDaLoja = resMaquinas.data.filter(m => m.loja === loja);

      // 3. Cria um novo registro de fechamento por máquina
      for (const maquina of maquinasDaLoja) {
        await api.post('/fecharmaquinas', {
          caixaId: novoCaixa.id, // <-- necessário para relacionamento
          maquinaId: maquina.id,
          maquina: maquina.numeroMaquina || maquina.id,
          entradaFinal: 0, // será preenchido no fechamento
          saidaFinal: 0,
          resultado: 0,
          usuario: usuarioLogado.nome,
          usuarioId: usuarioLogado.id,
          dataHora: new Date().toISOString(),
          fechado: 0 // aberto
        });
      }

      // 4. Navega para home
      navigate('/app/home-caixa');
    } catch (err) {
      console.error('Erro ao abrir caixa ou criar fechamentos:', err);
      alert('Erro ao abrir o caixa.');
    }
  };

  return (
    <div className="containerCaixa">
      <h1>FUNDO INICIAL</h1>
      <form onSubmit={handleSubmit}>
        <div className="coluna-esquerda-caixa">
          <label>FUNDO INICIAL :</label>
          <input 
            className='inpuCaixa' 
            value={fundoInicial} 
            onChange={(event) => setFundoInicial(event.target.value)} 
          />

          <label>DATA :</label>
          <input 
            className='inpuCaixa' 
            type="date" 
            value={data} 
            onChange={(event) => setData(event.target.value)} 
          />

          <label>SETOR:</label>
          <select 
            className='inpuCaixaSelect' 
            value={setor} 
            onChange={(event) => setSetor(event.target.value)}
          >
            <option value="setor1">SETOR 1</option>
            <option value="setor2">SETOR 2</option>
            <option value="setor3">SETOR 3</option>
            <option value="setor4">SETOR 4</option>
            <option value="todos">TODOS</option>
          </select>

          <label>Loja:</label>
          <select 
            className='inpuCaixaSelect' 
            value={loja} 
            onChange={(event) => setLoja(event.target.value)}
          >
            <option value="">Selecione uma Loja</option>
            {lojas && lojas.map((j) => (
              <option key={j.id || j.loja} value={j.loja}>
                {j.loja}
              </option>
            ))}
          </select>
        </div>
        <button className='btn-abrir'>Abrir Caixa</button>
      </form>
    </div>
  );
}

export default AbrirCaixa;
