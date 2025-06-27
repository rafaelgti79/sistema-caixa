import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js';



function Despesas() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState('');
  const [lojas, setLojas] = useState([]);

  useEffect(() => {
    async function carregarLojas() {
      try {
        const response = await api.get('/lojas');
        setLojas(response.data);
      } catch (error) {
        console.error('Erro ao buscar lojas:', error);
      }
    }

    carregarLojas();
  }, []);
  

  const handleSubmit = async (event) => {
  event.preventDefault();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const dataHoje = new Date().toISOString().split('T')[0];

  const despesas = {
    descricao,
    valor,
    categoria,
    loja: lojaSelecionada,
    usuario: usuarioLogado.nome,
    data: dataHoje
  };

  try {
    await api.post("/despesas", despesas);
    setDescricao('');
    setValor('');
    setCategoria('');
    setLojaSelecionada('');
  } catch (error) {
    console.error("Erro ao salvar despesa:", error);
  }
};

  return (
    <div className="containerDespesas">
      <h1>DESPESAS</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
            <label>DESCRICAO :</label>
            <input type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
           <label>VALOR:</label>
            <input type="text" value={valor} onChange={(event) => setValor(event.target.value)} />
            <label>CATEGORIA:</label>
            <input type="text" value={categoria} onChange={(event) => setCategoria(event.target.value)} />

          <label>LOJA:</label>
          <select
            value={lojaSelecionada}
            onChange={(e) => setLojaSelecionada(e.target.value)}
          >
            <option value="">Selecione uma Loja</option>
            {Array.isArray(lojas) &&
              lojas.map((j) => (
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
export default Despesas;
            
          
       

        
