import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';
import './Cartao.css';


function Cartao() {
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');
  const [cartoes, setCartoes] = useState([]);
  const [cartaoUsuario, setCartaoUsuario] = useState([]);
  const [totalCartaoAbertas, setTotalcartaoAbertas] = useState(0);
  const [caixaAberto, setCaixaAberto] = useState(null);
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  // 🔹 Buscar o caixa aberto ao carregar
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

 // 🔹 Função reutilizável para carregar os cartões do usuário
  const carregarCartaoUsuario = async () => {
    if (!caixaAberto) return;

    try {
      const res = await api.get('/cartao', {
        params: { caixaId: caixaAberto.id }
      });

      const cartaoFiltradas = res.data.filter(d => d.fechado === 0);
      setCartaoUsuario(cartaoFiltradas);
    } catch (err) {
      console.error('Erro ao carregar cartões:', err);
    }
  };

  // 🔹 Chamar o carregamento de cartões quando o caixa for definido
  useEffect(() => {
    carregarCartaoUsuario();
  }, [caixaAberto]);

  
  
  //Deletar as Cartao
  const deletarCartao = async (id) => {
    try {
      await api.delete(`/cartao/${id}`);
      setCartaoUsuario(cartaoUsuario.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Erro ao deletar Cartao:', err);
    }
  };
  
   // 🔹 Calcular total dos cartões abertos
  useEffect(() => {
    const total = cartaoUsuario.reduce((acc, d) => acc + parseFloat(d.valor || 0), 0);
    setTotalcartaoAbertas(total);
  }, [cartaoUsuario]);


// 🔹 Salvar novo cartão
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!valor || !tipo) {
      alert("Preencha todos os campos.");
      return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuarioLogado || !usuarioLogado.nome) {
      alert("Usuário não autenticado.");
      return;
    }

    if (!caixaAberto) {
  alert('Nenhum caixa aberto encontrado.');
  return;
}

    const dataHoje = new Date().toISOString().split('T')[0];

    const novoCartao = {
      valor: parseFloat(valor),
      tipo,
      usuario: usuarioLogado.nome,
      data: dataHoje,
      caixaId: caixaAberto.id 
    };

   try {
      await api.post("/cartao", novoCartao);
      setValor('');
      setTipo('');

      // ✅ Recarregar lista de cartões imediatamente após salvar
      await carregarCartaoUsuario();
    } catch (error) {
      console.error("Erro ao salvar cartão:", error);
      alert("Erro ao salvar cartão.");
    }
  };
  

  
  return (
    <div className="containerCartao">
      <h1>CARTÕES</h1>
      <form onSubmit={handleSubmit}>
        
          <label>VALOR:</label>
          <input className='inpuCaixaCartao'
            type="number"
            step="0.01"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />

   <label>Tipo:</label>
<select className='inpuCaixaSelectCartao' value={tipo} onChange={(event) => setTipo(event.target.value)}>
  <option value="">Selecione o Tipo</option>
  <option value="credito">Credito</option>
  <option value="debito">Debito</option>
  <option value="pix">Pix</option>
</select>
        

        
                
        <div className="lista-Cartao">
                {cartaoUsuario.length === 0 ? (
                  <p></p>
                ) : (
                  <ul>
                    {cartaoUsuario.map((cartao) => (
                      <li key={cartao.id}>
                        <strong>{cartao.tipo}</strong> - R$ {parseFloat(cartao.valor).toFixed(2)}
                        <button
                          style={{ marginLeft: '10px', color: 'white' }}
                          onClick={() => deletarCartao(cartao.id)}
                        >
                          Excluir
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p><strong>Total:</strong> R$ {totalCartaoAbertas.toFixed(2)}</p>

      <div className="btn-abrirCartao">
        <button className='btn-salvarCartao' type="submit">Salvar</button>
        <Link className="btn-voltarCartao" type="button" to="/app/home-caixa">Voltar</Link>
      </div>
    </div>
      
    </form>
  </div>
  );
}

export default Cartao;



         
          
       

        
