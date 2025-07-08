import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';




function Sangria() {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [conta, setConta] = useState('');
  const [contas, setContas] = useState([]);
  const [nome, setNome] = useState([]);
  const [loja, setLoja] = useState('');
  const [lojas, setLojas] = useState([]);
  const [sangriaUsuario, setSangriaUsuario] = useState([]);
  const [totalSangriaAbertas, setTotalSangriaAbertas] = useState(0);


//Sangria dos usuarios
    useEffect(() => {
    async function carregarSangriaUsuario() {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const hoje = new Date().toISOString().split('T')[0];
  
      try {
        const res = await api.get('/sangria');
        const sangriaFiltradas = res.data.filter(
          (d) =>
            d.usuario === usuarioLogado.nome &&
            d.data?.startsWith(hoje) &&
            d.fechado === 0
        );
        setSangriaUsuario(sangriaFiltradas);
      } catch (err) {
        console.error('Erro ao carregar Sangria do usuário:', err);
      }
    }
  
    carregarSangriaUsuario();
  }, []);
  
  
  //Deletar as Dinheiro
  const deletarSangria = async (id) => {
    try {
      await api.delete(`/sangria/${id}`);
      setSangriaUsuario(sangriaUsuario.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar Dinheiro:', err);
    }
  };
  
  //Total dos Dinheiro
  useEffect(() => {
    const total = sangriaUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
    setTotalSangriaAbertas(total);
  }, [sangriaUsuario]);

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
        
        
        <div className="lista-despesas">
                        <h2>Sangria</h2>
                        {sangriaUsuario.length === 0 ? (
                          <p></p>
                        ) : (
                          <ul>
                            {sangriaUsuario.map((sangria) => (
                              <li key={sangria.id}>
                                <strong>{sangria.id}</strong> - R$ {parseFloat(sangria.valor).toFixed(2)}
                                <button
                                  style={{ marginLeft: '10px', color: 'red' }}
                                  onClick={() => deletarSangria(sangria.id)}
                                >
                                  Excluir
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p><strong>Total:</strong> R$ {totalSangriaAbertas.toFixed(2)}</p>
                        <div className="botao-salvar">
                                <button type="submit">Salvar</button>
                                <Link className="BotaoVoltar" to="/app/home-caixa">Voltar</Link>
                              </div>
                      </div>
      </form>
    </div>
  );
}
export default Sangria;
            
          
       

        
