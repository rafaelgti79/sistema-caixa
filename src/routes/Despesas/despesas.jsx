import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js';
import { Link } from 'react-router-dom';



function Despesas() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState('');
  const [lojas, setLojas] = useState([]);
  const [despesasUsuario, setDespesasUsuario] = useState([]);
  const [totalDespesasAbertas, setTotalDespesasAbertas] = useState(0);

  //Despesas dos usuarios
  useEffect(() => {
  async function carregarDespesasUsuario() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const hoje = new Date().toISOString().split('T')[0];

    try {
      const res = await api.get('/despesas');
      const despesasFiltradas = res.data.filter(
        (d) =>
          d.usuario === usuarioLogado.nome &&
          d.data?.startsWith(hoje) &&
          d.fechado === 0
      );
      setDespesasUsuario(despesasFiltradas);
    } catch (err) {
      console.error('Erro ao carregar despesas do usuário:', err);
    }
  }

  carregarDespesasUsuario();
}, []);


//Deletar as despesas
const deletarDespesa = async (id) => {
  try {
    await api.delete(`/despesas/${id}`);
    setDespesasUsuario(despesasUsuario.filter((d) => d.id !== id));
  } catch (err) {
    console.error('Erro ao deletar despesa:', err);
  }
};

//Total das despesas
useEffect(() => {
  const total = despesasUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
  setTotalDespesasAbertas(total);
}, [despesasUsuario]);

//Carregar Lojas 
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
        
        
      </form>

<div className="lista-despesas">
  <h2>Despesas Abertas</h2>
  {despesasUsuario.length === 0 ? (
    <p>Nenhuma despesa aberta encontrada.</p>
  ) : (
    <ul>
      {despesasUsuario.map((despesa) => (
        <li key={despesa.id}>
          <strong>{despesa.descricao}</strong> - R$ {parseFloat(despesa.valor).toFixed(2)} ({despesa.categoria})
          <button
            style={{ marginLeft: '10px', color: 'red' }}
            onClick={() => deletarDespesa(despesa.id)}
          >
            Excluir
          </button>
        </li>
      ))}
    </ul>
  )}
  <p><strong>Total:</strong> R$ {totalDespesasAbertas.toFixed(2)}</p>
  <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
        </div>
</div>

    </div>
  );
}
export default Despesas;
            
          
       

        
