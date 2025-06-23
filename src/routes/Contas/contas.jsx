import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch.jsx';
import './contas.css';

const url = "http://localhost:3000/conta";

function Conta() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');
  const [porcentagem, setPorcentagem] = useState('');
  
  const {data: items, httpConfig} = useFetch(url);

  const handleSubmit = (event) => {
    event.preventDefault();

    const conta = {
      nome,
      senha,
      tipo,
      porcentagem,
      
    };
    
    httpConfig(conta, "POST");
    setNome('');
    setSenha('');
    setTipo('');
    setPorcentagem('');

  };

  return (
    <div className="container">
      <h1>CONTAS DE ACESSO</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>NOME :</label>
            <input type="text" value={nome} onChange={(event) => setNome(event.target.value)} />
           <label>SENHA:</label>
            <input type="text" value={senha} onChange={(event) => setSenha(event.target.value)} />


<label>TIPO:</label>
<select value={tipo} onChange={(event) => setTipo(event.target.value)}>
  <option value="">Selecione o Tipo</option>
  <option value="admin">Admin</option>
  <option value="operador">Operador</option>
  <option value="caixa">Caixa</option>
</select>
            <label>PORCENTAGEM:</label>
            <input type="text" value={porcentagem} onChange={(event) => setPorcentagem(event.target.value)} />
          </div>
            
          
        </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
          <Link className="BotaoVoltar" to="/app/cadastros">Voltar</Link>
        </div>
      </form>
    </div>
  );
}
export default Conta;

        
