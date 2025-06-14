import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import './login.css';


function Login() {
  const [usuario, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  


  const handleLogin = () => {

    // Simulando dados de login (idealmente usar API backend)
    const usuarios = {
      admin: { senha: '1234', tipo: 'admin' },
      operador: { senha: '1234', tipo: 'operador' },
      rafael: { senha: '1234', tipo: 'caixa' },
      barbie: { senha: '1234', tipo: 'admin' },
      
    };

    if (usuarios[usuario] && usuarios[usuario].senha === senha) {
      localStorage.setItem('usuarioLogado', JSON.stringify({ nome: usuario, tipo: usuarios[usuario].tipo }));
      navigate('/app/home');
    } else {
      alert('Usuário ou senha inválidos');
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