import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../constants/api.js';
import './login.css';

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
        login(usuarioLogado); // contexto
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
    <div className='containerLogi'>
      <form >
      <h2>Login</h2>

      <div>
      <input className='input-box' type="email" placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
      <FaUser className='icon' />
      </div>

      <div>
      <input className='input-box' type="password" placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />
      <FaLock className='icon' />
      </div>
      <label>
        <input type="checkbox" />
        Lembrar de mim
      </label>
      
      <button onClick={handleLogin}>Entrar</button>
      </form>
    </div>
  );
}

export default Login;

      
      
