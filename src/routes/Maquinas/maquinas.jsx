import { useState } from 'react';
import { useFetch } from '../hooks/useFetch.jsx';

const url = "http://localhost:3000/maquinas";


function Maquinas() {
  const [loja, setLoja] = useState('');
  const [numeroMaquina, setNumeroMaquina] = useState('');
  const [jogo, setJogo] = useState('');
  const [maquineiro, setMaquineiro] = useState('');
  const [setor, setSetor] = useState('');
  const [entrada, setEntrada] = useState('');
  const [saida, setSaida] = useState('');
  const { data: jogos, } = useFetch('http://localhost:3000/jogos');
  const { data: lojas, } = useFetch('http://localhost:3000/lojas');
  const [valorJogo, setValorJogo] = useState('');
  



  const {data: items, httpConfig} = useFetch(url);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const maquinas = {
      loja,
      numeroMaquina,
      jogo,
      valorJogo,
      maquineiro,
      setor,
      entrada,
      saida,
    };
    
    httpConfig(maquinas, "POST");
  };

  return (
    <div className="container">
      <h1>Cadastro de Máquinas</h1>
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

    <label>Número da Máquina:</label>
    <input type="text" value={numeroMaquina} onChange={(event) => setNumeroMaquina(event.target.value)} />
           
<label>Jogo:</label>
<select
  value={jogo}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setJogo(nomeSelecionado);
    const jogoSelecionado = jogos.find(j => j.nomedojogo === nomeSelecionado);
    if (jogoSelecionado) {
      setValorJogo(jogoSelecionado.valorJogo);
    }
  }}
>
  <option value="">Selecione um jogo</option>
  {jogos && jogos.map((j) => (
    <option key={j.id || j.nomedojogo} value={j.nomedojogo}>
      {j.nomedojogo}
    </option>
  ))}
</select>
            <label>Maquineiro:</label>
            <input type="text" value={maquineiro} onChange={(event) => setMaquineiro(event.target.value)} />
          </div>

          <div className="coluna-direita">
            <label>Setor:</label>
            <input type="text" value={setor} onChange={(event) => setSetor(event.target.value)} />
            <label>Entrada:</label>
            <input type="number" value={entrada} onChange={(event) => setEntrada(event.target.value)} />
            <label>Saída:</label>
            <input type="number" value={saida} onChange={(event) => setSaida(event.target.value)} />
          </div>
        </div>
        <div className="botao-salvar">
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}
export default Maquinas;

        
