import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';
import api from '../../constants/api.js';
import './home.css';

function Home() {
 const { user, loading } = useAuth();

  const tipo = user?.tipo || '';
  const nomeUsuario = user?.nome || '';

  const [redirecionarParaHomeCaixa, setRedirecionarParaHomeCaixa] = useState(false);
  const [redirecionarParaAbrirCaixa, setRedirecionarParaAbrirCaixa] = useState(false);
  const [verificado, setVerificado] = useState(false);

  const [caixas, setCaixas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [cartao, setCartao] = useState([]);
  const [reforco, setReforco] = useState([]);
  const [dinheiro, setDinheiro] = useState([]);
  const [sangria, setSangria] = useState([]);

  // ✅ 1. Redireciona se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      setRedirecionarParaAbrirCaixa(true);
    }
  }, [loading, user]);

  // ✅ 2. Verifica se há caixa aberto
 useEffect(() => {
  const checkCaixaAberto = async () => {
    if (!user || tipo === 'admin') {
      setVerificado(true); // Admin pula verificação
      return;
    }

    try {
      const { data } = await api.get('/caixa', {
        params: {
          status: 'aberto',
          usuario: nomeUsuario,
        },
      });

      const caixaAberto = data.find(item => item.fechado === 0);

      if (caixaAberto) {
        console.log('✅ Caixa ABERTO detectado → redirecionando para /app/home-caixa');
        setRedirecionarParaHomeCaixa(true);
      } else {
        console.log('⚠️ Nenhum caixa aberto → redirecionando para /app/abrir-caixa');
        setRedirecionarParaAbrirCaixa(true);
      }

      setVerificado(true);
    } catch (err) {
      console.error('❌ Erro ao consultar caixa:', err);
    }
  };

  checkCaixaAberto();
}, [user, tipo, nomeUsuario]);


  useEffect(() => {
    if (!user) return;

    const params = tipo === 'admin'
      ? { status: 'aberto' }
      : { status: 'aberto', usuario: nomeUsuario };

    api.get('/caixa', { params }).then(res => setCaixas(res.data)).catch(console.error);
    api.get('/despesas').then(res => setDespesas(res.data)).catch(console.error);
    api.get('/cartao').then(res => setCartao(res.data)).catch(console.error);
    api.get('/reforco').then(res => setReforco(res.data)).catch(console.error);
    api.get('/dinheiro').then(res => setDinheiro(res.data)).catch(console.error);
    api.get('/sangria').then(res => setSangria(res.data)).catch(console.error);
  }, [user, tipo, nomeUsuario]);

  if (loading) return <p>Carregando...</p>;
  if (!user) return <p>Você não está autenticado.</p>;

  //Caluculo das despesas, sangria e etc...
  const somaPorCaixaId = (arr, caixaId) => {
  return arr
    .filter(d => d.caixaId === caixaId && d.fechado === 0)
    .reduce((total, d) => total + Number(d.valor || 0), 0)
    .toFixed(2);
};

// ✅ Redirecionamento controlado
  if (loading || !verificado) return <p>Carregando...</p>;

if (redirecionarParaHomeCaixa) return <Navigate to="/app/home-caixa" replace />;
if (redirecionarParaAbrirCaixa) return <Navigate to="/app/abrir-caixa" replace />;

  return (
    <div className="containerhome">
      <div className="colunatabel">
        {(tipo === "admin" || tipo === "caixa") && (
          <Link to="/app/abrir-caixa">Abrir Caixa</Link>
        )}
        {tipo === "admin" && (
          <>
            <Link to="/app/lista-maquinas">Lista de Máquinas</Link>
            <Link to="/app/cadastros">Cadastros Gerais</Link>
            <Link to="/app/relatorios">Relatório</Link>
            <Link to="/app/procurar-erros">Procurar Erros</Link>
            <Link to="/app/gerenciar-cozinha">Gerenciar Cozinha</Link>
            <Link to="/app/checar-leitura">Checar Leitura</Link>
            <Link to="/app/gerenciar-sistema">Gerenciar Sistema</Link>
            <Link to="/app/pagamento-superios">Pagamento Superior</Link>
            <Link to="/app/procurar-pagamentos">Procurar Pagamentos</Link>
          </>
        )}
        {(tipo === "admin" || tipo === "operador") && (
          <Link to="/app/despesas-extra">Despesas Extras</Link>
        )}
      </div>

      <div>
        <ul className="grid-list">
          {caixas.length > 0 ? (
            caixas
              .filter(item => item.status === 'aberto')
              .filter(item => tipo === 'admin' || item.usuario === nomeUsuario)
              .map(item => (
                <li key={item.id} className="grid-item">
                  <div className="grid-row"><span className="label">CONTA:</span> <span className="value">{item.usuario}</span></div>
                  <div className="grid-row"><span className="label">DATA:</span> <span className="value">{item.data}</span></div>
                  <div className="grid-row"><span className="label">SETOR:</span> <span className="value">{item.setor}</span></div>
                  <div className="grid-row"><span className="label">FUNDO INICIAL:</span> <span className="value">R$ {item.fundoInicial}</span></div>
                  <div className="grid-row"><span className="label">LOJA:</span> <span className="value">{item.loja}</span></div>

                  <p>INFORMAÇÕES DO CAIXA</p>
                  <div className="grid-row"><span className="label">Fechamento:</span> <span className="value">0</span></div>
                  <div className="grid-row"><span className="label">Despesas:</span> <span className="value">R$ {somaPorCaixaId(despesas, item.id, nomeUsuario)}</span></div>
                  <div className="grid-row"><span className="label">Dinheiro:</span> <span className="value">R$ {somaPorCaixaId(dinheiro, item.id, nomeUsuario)}</span></div>
                  <div className="grid-row"><span className="label">Reforço:</span> <span className="value">R$ {somaPorCaixaId(reforco, item.id, nomeUsuario)}</span></div>
                  <div className="grid-row"><span className="label">Cartões:</span> <span className="value">R$ {somaPorCaixaId(cartao, item.id, nomeUsuario)}</span></div>
                  <div className="grid-row"><span className="label">Sangria:</span> <span className="value">R$ {somaPorCaixaId(sangria, item.id, nomeUsuario)}</span></div>

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
    </div>
  );
}

export default Home;
