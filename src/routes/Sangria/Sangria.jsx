import React, { useState, useEffect } from 'react';
import api from '../../constants/api';




function Sangria() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [conta, setConta] = useState('');
  const [contas, setContas] = useState([]);
  const [nome, setNome] = useState([]);
  const [loja, setLoja] = useState('');
  const [lojas, setLojas] = useState([]);




  // 🔄 Buscar lojas e jogos da API (porta 3001)
    useEffect(() => {
      async function fetchData() {
        try {
          const [resLojas, resContas] = await Promise.all([
            api.get("/lojas"),
            api.get("/conta"),
          ]);
          setLojas(resLojas.data);
          setContas(resContas.data);
        } catch (error) {
          console.error("Erro ao buscar dados:", error);
        }
      }
  
      fetchData();
    }, []);
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    // Adicionar data atual altomatico
      const dataHoje = new Date().toISOString().split('T')[0];
    
    const sangria = {

      descricao,
      valor,
      nome,
      loja,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };

   try {
      await api.post('/sangria', sangria);
      setDescricao('');
      setValor('');
      setConta('');
      setLoja('');
    } catch (error) {
      console.error('Erro ao salvar sangria:', error);
    }
  };

  
  return (
    <div className="containerDespesas">
      <h1>SANGRIA</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>DESCRICAO :</label>
            <input type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />

<select
  value={conta}
  onChange={(event) => {
    const contaSelecionado = event.target.value;
    setConta(contaSelecionado);
  }}
>
  <option value="">RESPONSAVEL</option>
   {contas && contas.map((j) => (
    <option key={j.id || j.nome} value={j.nome}>
      {j.nome}
    </option>
  ))}
</select>

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
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Sangria;
            
          
       

        
