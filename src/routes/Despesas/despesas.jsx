import React, { useState, useEffect } from 'react';
import api from '../../constants/api.js';
import { Link } from 'react-router-dom';
import './despesas.css';



function Despesas() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState('');
  const [lojaSelecionada, setLojaSelecionada] = useState('MAX');
  const [lojas, setLojas] = useState([]);
  const [despesasUsuario, setDespesasUsuario] = useState([]);
  const [totalDespesasAbertas, setTotalDespesasAbertas] = useState(0);
  const [caixaAberto, setCaixaAberto] = useState(null); // ✅ novo estado para guardar o caixa

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // ✅ Buscar o caixa aberto do usuário ao carregar a tela
  useEffect(() => {
    async function buscarCaixaAberto() {
      try {
        const res = await api.get('/caixa', {
          params: {
            status: 'aberto',
            usuario: usuarioLogado.nome
          }
        });

        // Já vem filtrado pelo status
      const caixa = res.data[0];
      if (caixa) setCaixaAberto(caixa);
    } catch (error) {
      console.error('Erro ao buscar caixa aberto:', error);
    }
  }

    buscarCaixaAberto();
  }, [usuarioLogado.nome]);

  // ✅ Buscar despesas com base no caixaId
  useEffect(() => {
    async function carregarDespesasUsuario() {
      if (!caixaAberto) return;

      try {
        const res = await api.get('/despesas', {
          params: {
            caixaId: caixaAberto.id
          }
        });
        const despesasFiltradas = res.data.filter(d => d.fechado === 0);
        setDespesasUsuario(despesasFiltradas);
      } catch (err) {
        console.error('Erro ao carregar despesas do usuário:', err);
      }
    }
    carregarDespesasUsuario();
  }, [caixaAberto]);



  // Total das despesas
  useEffect(() => {
    const total = despesasUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
    setTotalDespesasAbertas(total);
  }, [despesasUsuario]);

  // Carregar Lojas
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

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar Categorias:', error);
      }
    }
    carregarCategorias();
  }, []);


  // ✅ Substituir o salvamento com data pelo caixaId
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!caixaAberto) {
      alert('Nenhum caixa aberto encontrado.');
      return;
    }

    const dataHoje = new Date().toISOString().split('T')[0]; // ou use caixaAberto.data se estiver disponível
    const valorNumerico = parseFloat(valor.replace(',', '.'));

    const novaDespesa = {
      descricao,
      valor: valorNumerico,
      categoria,
      loja: lojaSelecionada,
      usuario: usuarioLogado.nome,
      caixaId: caixaAberto.id, // ✅ nova forma de vincular
      data: dataHoje 
    };

    try {
      await api.post('/despesas', novaDespesa);
      setDescricao('');
      setValor('');
      setCategoria('');
      

      // Recarregar lista de despesas
      const res = await api.get('/despesas', {
        params: { caixaId: caixaAberto.id }
      });
      setDespesasUsuario(res.data.filter(d => d.fechado === 0));
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
    }
  };

  // Deletar despesas
  const deletarDespesa = async (id) => {
    try {
      await api.delete(`/despesas/${id}`);
      setDespesasUsuario(despesasUsuario.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar despesa:', err);
    }
  };

  return (
    <div className="containerCastroDespesas">
      <h1>DESPESAS</h1>
      <form onSubmit={handleSubmit}>
        
          <label>DESCRICAO :</label>
          <input className='inpuCaixaDespesa' type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <label>VALOR:</label>
          <input className='inpuCaixaDespesa' type="text" value={valor} onChange={(e) => setValor(e.target.value)} />

          <label>CATEGORIA:</label>
          <select className='inpuCaixaSelectDespesa'
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione uma Categoria</option>
            {Array.isArray(categorias) &&
              categorias.map((j) => (
                <option key={j.id || j.categoria} value={j.categoria}>
                  {j.categoria}
                </option>
              ))}
          </select>

          <label>LOJA:</label>
          <select className='inpuCaixaSelectDespesa'
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
        

      <div className="lista-despesas">
        <h2></h2>
        {despesasUsuario.length === 0 ? (
          <p>Nenhuma despesa aberta encontrada.</p>
        ) : (
          <ul>
            {despesasUsuario.map((despesa) => (
              <li key={despesa.id}>
                <strong>{despesa.descricao}</strong> - R$ {parseFloat(despesa.valor).toFixed(2)} ({despesa.categoria})
                <button
                  style={{ marginLeft: '10px', color: 'white' }}
                  onClick={() => deletarDespesa(despesa.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
        <p><strong>Total:</strong> R$ {totalDespesasAbertas.toFixed(2)}</p>
      </div>
                <div className="btn-abrirDespesa">
                  <button className='btn-salvarDespesa' type="submit">Salvar</button>
                  <Link className="btn-voltarDespesa" to="/app/home-caixa">Voltar</Link>
                </div>
        
              </form>
    </div>
  );
}

export default Despesas;
