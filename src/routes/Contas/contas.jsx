import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../constants/api.js';
import { useNavigate } from 'react-router-dom';
import './contas.css';

function Conta() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');
  const [porcentagem, setPorcentagem] = useState('');
  const [contas, setContas] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();


  // Buscar contas existentes (GET)
  useEffect(() => {
    async function fetchContas() {
      try {
        const response = await api.get('/conta');
        setContas(response.data);
      } catch (error) {
        console.error('Erro ao buscar contas:', error);
      }
    }

    fetchContas();
  }, []);

const preencherParaEditar = (conta) => {
  setNome(conta.nome);
  setSenha(conta.senha);
  setTipo(conta.tipo);
  setPorcentagem(conta.porcentagem);
  setEditandoId(conta.id);
};

const deletarConta = async (id) => {
  if (!window.confirm("Tem certeza que deseja excluir?")) return;

  try {
    await api.delete(`/conta/${id}`);
    const { data } = await api.get('/conta');
    setContas(data);
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    alert("Erro ao excluir conta");
  }
};

  // Enviar nova conta (POST)
  const handleSubmit = async (event) => {
    event.preventDefault();

    const novaConta = {
      nome,
      senha,
      tipo,
      porcentagem,
    };

    try {
      await api.post('/conta', novaConta);
      setNome('');
      setSenha('');
      setTipo('');
      setPorcentagem('');

      // Recarregar lista
      const { data } = await api.get('/conta');
      setContas(data);

    } catch (error) {
      console.error('Erro ao cadastrar conta:', error);
      alert('Erro ao salvar conta.');
    }
  };

  return (
    <div className="containerCadasContas">
      <h1>CONTAS</h1>
      <form onSubmit={handleSubmit}>
        
            <label>NOME :</label>
            <input className='inpuCaixaMaquina' type="text" value={nome} onChange={(event) => setNome(event.target.value)} />
           <label>SENHA:</label>
            <input className='inpuCaixaMaquina' type="text" value={senha} onChange={(event) => setSenha(event.target.value)} />


<label>TIPO:</label>
<select className='inpuCaixaSelectMaquina' value={tipo} onChange={(event) => setTipo(event.target.value)}>
  <option value="">Selecione o Tipo</option>
  <option value="admin">Admin</option>
  <option value="operador">Operador</option>
  <option value="caixa">Caixa</option>
</select>
            <label>PORCENTAGEM:</label>
            <input type="text" value={porcentagem} onChange={(event) => setPorcentagem(event.target.value)} />
          
            
          
       
        <div className='btn-abrirMaquina'>
          <button className='btn-salvar'  type="submit">Salvar</button>
          <button className='btn-voltar' type="button" onClick={() => navigate('/app/cadastros')}>Voltar</button>
         </div>
      </form>

      <h2>Contas cadastradas</h2>
<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Tipo</th>
      
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {contas.map((c) => (
      <tr key={c.id}>
        <td>{c.nome}</td>
        <td>{c.tipo}</td>
        
        <td>
          <button onClick={() => preencherParaEditar(c)}>Editar</button>
          <button onClick={() => deletarConta(c.id)}>X</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
}
export default Conta;

        
