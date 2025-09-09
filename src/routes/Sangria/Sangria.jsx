import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';
import './sangria.css';


function Sangria() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [conta, setConta] = useState('');
  const [contas, setContas] = useState([]);
  const [loja, setLoja] = useState('MAX');
  const [lojas, setLojas] = useState([]);
  const [sangriaUsuario, setSangriaUsuario] = useState([]);
  const [totalSangriaAbertas, setTotalSangriaAbertas] = useState(0);
  const [caixaAberto, setCaixaAberto] = useState(null);

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // 🔍 Buscar caixa aberto
  useEffect(() => {
    async function buscarCaixaAberto() {
      try {
        const res = await api.get('/caixa', {
          params: {
            status: 'aberto',
            usuario: usuarioLogado.nome
          }
        });
        const caixa = res.data[0];
        if (caixa) setCaixaAberto(caixa);
      } catch (error) {
        console.error('Erro ao buscar caixa aberto:', error);
      }
    }

    buscarCaixaAberto();
  }, [usuarioLogado.nome]);

  // 🧾 Buscar sangrias do dia e caixa atual
  useEffect(() => {
  if (caixaAberto) {
    carregarSangriaUsuario();
  }
}, [caixaAberto]);

const carregarSangriaUsuario = async () => {
  if (!caixaAberto) return;

  try {
    const res = await api.get('/sangria', {
      params: { caixaId: caixaAberto.id }
    });

    const hoje = new Date().toISOString().split('T')[0];
    const filtradas = res.data.filter(
      (d) =>
        d.usuario === usuarioLogado.nome &&
        d.data?.startsWith(hoje) &&
        d.fechado === 0
    );
    setSangriaUsuario(filtradas);
  } catch (err) {
    console.error('Erro ao carregar Sangria do usuário:', err);
  }
};
  // 🗑️ Deletar sangria
  const deletarSangria = async (id) => {
    try {
      await api.delete(`/sangria/${id}`);
      setSangriaUsuario(sangriaUsuario.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar Sangria:', err);
    }
  };

  // 🧮 Total da sangria
  useEffect(() => {
    const total = sangriaUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
    setTotalSangriaAbertas(total);
  }, [sangriaUsuario]);

  // 🔄 Buscar lojas e contas
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

  // ✅ Submeter nova sangria
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!descricao || !valor || !conta || !loja) {
      alert("Preencha todos os campos.");
      return;
    }

    if (!caixaAberto) {
      alert("Nenhum caixa aberto encontrado.");
      return;
    }

    const dataHoje = new Date().toISOString().split('T')[0];

    const sangria = {
      descricao,
      valor: parseFloat(valor),
      nome: conta,
      loja,
      usuario: usuarioLogado.nome,
      data: dataHoje,
      caixaId: caixaAberto.id // ✅ Incluído
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
    // 🔄 Atualizar lista
    await carregarSangriaUsuario();
  };

  
  return (
    <div className="containerCastroSangria">
      <h1>SANGRIA</h1>
      <form onSubmit={handleSubmit}>
          
            <label>DESCRICAO :</label>
            <input className='inpuCaixaSangria' type="text" value={descricao} onChange={(event) => setDescricao(event.target.value)} />
           <label>VALOR:</label>
            <input className='inpuCaixaSangria' type="text" value={valor} onChange={(event) => setValor(event.target.value)} />

<select className='inpuCaixaSelectSangria'
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

<select className='inpuCaixaSelectSangria'
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
          
        
        
        <div className="lista-Sangria">
                        <h2>Sangria</h2>
                        {sangriaUsuario.length === 0 ? (
                          <p></p>
                        ) : (
                          <ul>
                            {sangriaUsuario.map((sangria) => (
                              <li key={sangria.id}>
                                <strong>{sangria.id}</strong> - R$ {parseFloat(sangria.valor).toFixed(2)}
                                <button
                                  style={{ marginLeft: '10px', color: 'white' }}
                                  onClick={() => deletarSangria(sangria.id)}
                                >
                                  Excluir
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p><strong>Total:</strong> R$ {totalSangriaAbertas.toFixed(2)}</p>
                        <div className="btn-abrirDinheiro">
                          <button className='btn-salvarDinheiro' type="submit">Salvar</button>
                          <Link className="btn-voltarDinheiro" to="/app/home-caixa">Voltar</Link>
                        </div>
                      </div>
      </form>
    </div>
  );
}
export default Sangria;
            
          
       

        
