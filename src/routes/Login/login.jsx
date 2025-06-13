import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulando dados de login (idealmente usar API backend)
    const usuarios = {
      admin: { senha: '1234', tipo: 'admin' },
      operador: { senha: '1234', tipo: 'operador' }
    };

    if (usuarios[usuario] && usuarios[usuario].senha === senha) {
      localStorage.setItem('usuarioLogado', JSON.stringify({ nome: usuario, tipo: usuarios[usuario].tipo }));
      navigate('/app/home');
    } else {
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <input type="text" placeholder="Usuário" onChange={(e) => setUsuario(e.target.value)} />
      <br />
      <input type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
      <br />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;