import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api.js';
import './AbrirCaixa.css';

function AbrirCaixa() {
  const [loja, setLoja] = useState('');
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

    const caixa = {
      fundoInicial,
      data,
      setor,
      loja,
      usuario: usuarioLogado.nome,
      status: 'aberto'
    };

    try {
      await api.post('/caixa', caixa);
      navigate('/app/home-caixa');
    } catch (err) {
      console.error('Erro ao abrir caixa:', err);
      alert('Erro ao abrir o caixa.');
    }
  };

  return (
    <div className="containerCaixa">
      <h1>COLOQUE O FUNDO INICIAL</h1>
      <form onSubmit={handleSubmit}>
       

          <div className="coluna-esquerda-caixa">
            <label>FUNDO INICIAL :</label>
            <input type="text" value={fundoInicial} onChange={(event) => setFundoInicial(event.target.value)} />

            <label>DATA :</label>
            <input type="date" value={data} onChange={(event) => setData(event.target.value)} />
            
   <label>SETOR:</label>
     <select value={setor} onChange={(event) => setSetor(event.target.value)}>
       <option value="setor1">SETOR 1</option>
       <option value="setor2">SETOR 2</option>
       <option value="setor3">SETOR 3</option>
       <option value="setor4">SETOR 4</option>
     </select>
       

<label>Loja:</label>
<select
  value={loja}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setLoja(nomeSelecionado);
  }}>
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

         
            
        
          
       
        

        
