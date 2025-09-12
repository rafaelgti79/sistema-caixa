import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../constants/api.js';
import './login.css';
import logo from '/dados-logo.jpg'; // ajuste o caminho conforme necessário

function Login() {
  const [usuario, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/login', { nome: usuario, senha });
      const usuarioLogado = response.data.contas;

      if (usuarioLogado) {
        login(usuarioLogado);
        localStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
        navigate('/app/home');
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert(error.response?.data?.error || 'Erro ao conectar com o servidor');
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='containerLogi'>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-image" />
        </div>

        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <div>
            <input
              className='input-box'
              type="nome"
              placeholder="Nome"
              onChange={(e) => setNome(e.target.value)}
            />
            <FaUser className='icon' />
          </div>

          <div>
            <input
              className='input-box'
              type="password"
              placeholder="Senha"
              onChange={(e) => setSenha(e.target.value)}
            />
            <FaLock className='icon' />
          </div>

          <label>
            <input type="checkbox" />
            Lembrar de mim
          </label>

          <button type="submit" class="botaoLogin login-button">Entrar</button>

        </form>


      </div>
    </div>
  );
}

export default Login;
