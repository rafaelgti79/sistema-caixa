import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../constants/api.js'; // atualize o caminho conforme sua estrutura
import './AbrirCaixa.css';

function AbrirCaixa() {
  const [loja, setLoja] = useState('');
  const [fundoInicial, setFundoInicial] = useState('');
  const [data, setData] = useState('');
  const [setor, setSetor] = useState('');
  const [lojas, setLojas] = useState([]);
  const navigate = useNavigate();

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

  // 🔒 Proteção: redireciona se caixa já estiver aberto
  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const key = usuarioLogado?.nome;
    if (localStorage.getItem(`caixaAberto_${key}`) === 'true' &&
        localStorage.getItem(`caixaFechado_${key}`) !== 'true') {
      navigate('/app/home-caixa');
    }
  }, [navigate]);

  // 📤 Envio de dados
  const handleSubmit = async (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const caixa = { 
      
      fundoInicial, 
      data, 
      setor, 
      loja,
      usuario: usuarioLogado.nome };

    try {
      await api.post('/caixa', caixa); // 👈 Rota ajustada para o backend
      localStorage.setItem(`caixaAberto_${usuarioLogado.nome}`, 'true');
      localStorage.setItem(`caixaFechado_${usuarioLogado.nome}`, 'false');
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
            <label>SETOR :</label>
            <input type="text" value={setor} onChange={(event) => setSetor(event.target.value)} />

            <label>Loja:</label>
<select
  value={loja}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setLoja(nomeSelecionado);
   
  }}
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
            
        
          
       
        

        
