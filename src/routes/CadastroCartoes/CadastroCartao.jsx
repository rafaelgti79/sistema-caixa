import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './CadastroCartao.css';

const url = "http://localhost:3000/cartao";



function CadastroCartao() {
  const [loja, setLoja] = useState('');
  const [descricaoCatao, setDescricaoCatao] = useState('');
  const [procentagemAluguel, setProcentagemAluguel] = useState('');
  const { data: lojas, } = useFetch('http://localhost:3000/lojas');
  const navigate = useNavigate();

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
    <div className="containerCadasCartao">
      <h1>Cadastro de Cartões</h1>
      <form onSubmit={handleSubmit}>
        
          
<label>Loja:</label>
<select className='inpuCaixaSelectMaquina'
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
  <option value=""></option>
  {lojas && lojas.map((j) => (
    <option key={j.id || j.loja} value={j.loja}>
      {j.loja}
    </option>
  ))}
</select>

    <label>DESCRIÇÃO DO CARTÃO:</label>
    <input className='inpuCaixaMaquina' type="text" value={descricaoCatao} onChange={(event) => setDescricaoCatao(event.target.value)} />

    <label>PORCENTAGEM:</label>
    <input className='inpuCaixaMaquina' type="text" value={procentagemAluguel} onChange={(event) => setProcentagemAluguel(event.target.value)} />
      
        <div className='btn-abrirMaquina'>
          <button className='btn-salvar'  type="submit">Salvar</button>
          <button className='btn-voltar' onClick={() => navigate('/app/cadastros')}>Voltar</button>
         </div>
      </form>
    </div>
  );
}
export default CadastroCartao;

        
            
          
        
