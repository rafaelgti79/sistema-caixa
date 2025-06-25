import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/cartao";

function Cartao() {
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');

  const { data: items, httpConfig } = useFetch(url);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!valor.trim() || !tipo.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    // Adicionar data atual altomatico
      const dataHoje = new Date().toISOString().split('T')[0];

    const cartao = {
      valor: parseFloat(valor),
      tipo,
      usuario: usuarioLogado.nome,
      data: dataHoje  // ✅ Adiciona a data automaticamente
    };

    httpConfig(cartao, "POST");

    setValor('');
    setTipo('');
  };

  return (
    <div className="containerDespesas">
      <h1>CARTÕES</h1>
      <form onSubmit={handleSubmit}>
        <div className="subcontainer">
          <label>VALOR:</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
          />

          <label>Tipo:</label>
<select value={tipo} onChange={(event) => setTipo(event.target.value)}>
  <option value="">Selecione o Tipo</option>
  <option value="credito">Credito</option>
  <option value="debito">Debito</option>
  <option value="pix">Pix</option>
</select>
        </div>

        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default Cartao;




/*
import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

const url = "http://localhost:3000/cartao";


function Cartao() {
  
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('');
  

 const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    const cartao = {

      valor: parseFloat(valor),
      tipo,
       usuario: usuarioLogado.nome
    };
    httpConfig(cartao, "POST");
    
    // Limpar os campos
    setValor('');
    setTipo('');
  

  };

  return (
    <div className="containerDespesas">
      <h1>CARTÕES</h1>
      <form onSubmit={handleSubmit}>
          <div className="subcontainer">
           
           <label>VALOR:</label>
            <input
  type="number"
  step="0.01"
  value={valor}
  onChange={(event) => setValor(event.target.value)}
/>
            <label>TIPO:</label>
            <input type="text" value={tipo} onChange={(event) => setTipo(event.target.value)} />

          </div>
        
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Cartao;
   */         
          
       

        
