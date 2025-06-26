import React, { useState, useEffect } from 'react';
import api from '../../constants/api';
import { Link } from 'react-router-dom';

function Loja() {
  const [loja, setLoja] = useState('');
  const [lojas, setLojas] = useState([]);

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
    <div className="container">
      <h1>Cadastro de Lojas</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">
            <label>NOME DA LOJA:</label>
            <input type="text" value={loja} onChange={(event) => setLoja(event.target.value)} />
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
export default Loja;
            
          

        
