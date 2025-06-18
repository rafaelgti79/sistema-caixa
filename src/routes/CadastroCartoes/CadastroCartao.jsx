import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { Link } from 'react-router-dom';

const url = "http://localhost:3000/cartao";



function CadastroCartao() {
  const [loja, setLoja] = useState('');
  const [descricaoCatao, setDescricaoCatao] = useState('');
  const [procentagemAluguel, setProcentagemAluguel] = useState('');
  const { data: lojas, } = useFetch('http://localhost:3000/lojas');

  const {data: items, httpConfig} = useFetch(url);
  

  const handleSubmit = (event) => {
    event.preventDefault();
     const cartao = {
      lojas,
      descricaoCatao,
      procentagemAluguel,
      
    };
    
    httpConfig(cartao, "POST");
  };


  return (
    <div className="container">
      <h1>Cadastro de Cartões</h1>
      <form onSubmit={handleSubmit}>
        <div className="colunas">
          <div className="coluna-esquerda">

<label>Loja:</label>
<select
  value={loja}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setLoja(nomeSelecionado);
    const jogoSelecionado = lojas.find(j => j.loja === nomeSelecionado);
    if (jogoSelecionado) {
      setValorJogo(jogoSelecionado.valorJogo);
    }
  }}
>
  <option value="">Selecione uma Loja</option>
  {lojas && lojas.map((j) => (
    <option key={j.id || j.loja} value={j.loja}>
      {j.loja}
    </option>
  ))}
</select>


           <label>DESCRIÇÃO DO CARTÃO:</label>
            <input type="text" value={descricaoCatao} onChange={(event) => setDescricaoCatao(event.target.value)} />
            <label>PORCENTAGEM DO ALUGUEL:</label>
            <input type="text" value={procentagemAluguel} onChange={(event) => setProcentagemAluguel(event.target.value)} />
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
export default CadastroCartao;

        
