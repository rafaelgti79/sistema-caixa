import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { useNavigate } from 'react-router-dom';
import './lojas.css';

function Loja() {
  const [loja, setLoja] = useState('');
  const [lojas, setLojas] = useState([]);
 const navigate = useNavigate();
 
  useEffect(() => {
    api.get('/lojas')
      .then((response) => setLojas(response.data))
      .catch((error) => console.error("Erro ao carregar lojas:", error));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!loja.trim()) {
      alert("Nome da loja é obrigatório.");
      return;
    }

    try {
      const response = await api.post('/lojas', { loja });
      setLojas(prev => [...prev, response.data]);
      setLoja('');
    } catch (error) {
      console.error("Erro ao salvar loja:", error);
      alert("Erro ao salvar loja.");
    }
  };


  return (
    <div className="containerLoja">
      <h1>Cadastro de Lojas</h1>
      <form onSubmit={handleSubmit}>
        
        <label>NOME DA LOJA:</label>
        <input className='inpuCaixaMaquina' type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
          
        <div className='btn-abrirMaquina'>
          <button className='btn-salvar'  type="submit">Salvar</button>
          <button className='btn-voltar' onClick={() => navigate('/app/cadastros')}>Voltar</button>
         </div>
          
      </form>
    </div>
  );
}
export default Loja;
        
           
         
        
            
          

        
