import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../constants/api.js';
import '../Home/home.css';

function HomeCaixa() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // SEMPRE declarar hooks antes de qualquer lógica condicional
  const [caixas, setCaixas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [cartao, setCartao] = useState([]);
  const [reforco, setReforco] = useState([]);
  const [dinheiro, setDinheiro] = useState([]);
  const [sangria, setSangria] = useState([]);

  // Derivar variáveis aqui, com fallback
  const tipo = user?.tipo || '';
  const nomeUsuario = user?.nome || '';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return; // só executa se user estiver pronto

    const params =
      tipo === 'admin'
        ? { status: 'aberto' }
        : { status: 'aberto', usuario: nomeUsuario };

    api.get('/caixa', { params }).then(res => setCaixas(res.data)).catch(console.error);
    api.get('/despesas').then(res => setDespesas(res.data)).catch(console.error);
    api.get('/cartao').then(res => setCartao(res.data)).catch(console.error);
    api.get('/reforco').then(res => setReforco(res.data)).catch(console.error);
    api.get('/dinheiro').then(res => setDinheiro(res.data)).catch(console.error);
    api.get('/sangria').then(res => setSangria(res.data)).catch(console.error);
  }, [tipo, nomeUsuario, user]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return null;

  //Caluculo das despesas, sangria e etc...
  const somaPorCaixaId = (arr, caixaId) => {
  return arr
    .filter(d => d.caixaId === caixaId && d.fechado === 0)
    .reduce((total, d) => total + Number(d.valor || 0), 0)
    .toFixed(2);
};

  return (
    <div className="containerhome">
      <div className="colunatabel">
        <Link to="/app/fechamentomaquinas">Fechar Maquinas</Link>
        <Link to="/app/despesas">Despesas</Link>
        <Link to="/app/reforco">Reforço</Link>
        <Link to="/app/cartao">Cartões</Link>
        <Link to="/app/dinheiro">Dinheiro</Link>
        <Link to="/app/sangria">Sangria</Link>
        <Link to="/app/fechamento/final">Fechamento Final</Link>
        <Link to="/">Sair</Link>
      </div>

      <ul className="grid-list">
        {caixas && caixas.length > 0 ? (
          caixas
            .filter(item => item.status === 'aberto')
            .filter(item => tipo === 'admin' || item.usuario === nomeUsuario)
            .map(item => (
              <li key={item.id} className="grid-item">
                <div className="grid-row"><span className="label">CONTA:</span> <span className="value">{item.usuario}</span></div>
                <div className="grid-row"><span className="label">DATA:</span> <span className="value">{item.data}</span></div>
                <div className="grid-row"><span className="label">SETOR:</span> <span className="value">{item.setor}</span></div>
                <div className="grid-row"><span className="label">FUNDO INICIAL:</span> <span className="value">R$ {Number(item.fundoInicial).toFixed(2)}</span></div>
                <div className="grid-row"><span className="label">LOJA:</span> <span className="value">{item.loja}</span></div>

                <p>INFORMAÇÕES DO CAIXA</p>
                <div className="grid-row"><span className="label">Fechamento:</span> <span className="value">0</span></div>
                <div className="grid-row"><span className="label">Despesas:</span> <span className="value">R$ {somaPorCaixaId(despesas, item.id)}</span></div>
                <div className="grid-row"><span className="label">Dinheiro:</span> <span className="value">R$ {somaPorCaixaId(dinheiro, item.id)}</span></div>
                <div className="grid-row"><span className="label">Reforço:</span> <span className="value">R$ {somaPorCaixaId(reforco, item.id)}</span></div>
                <div className="grid-row"><span className="label">Cartões:</span> <span className="value">R$ {somaPorCaixaId(cartao, item.id)}</span></div>
                <div className="grid-row"><span className="label">Sangria:</span> <span className="value">R$ {somaPorCaixaId(sangria, item.id)}</span></div>

                <p>PARCIAL DO CAIXA</p>
                <div className="grid-row"><span className="label">Arrecadações:</span> <span className="value">0</span></div>
                <div className="grid-row"><span className="label">Pagamentos:</span> <span className="value">0</span></div>
                <div className="grid-row"><span className="label">Resultado parcial:</span> <span className="value">0</span></div>
              </li>
            ))
        ) : (
          <p>Nenhum caixa aberto no momento.</p>
        )}
      </ul>
    </div>
  );
}

export default HomeCaixa;
