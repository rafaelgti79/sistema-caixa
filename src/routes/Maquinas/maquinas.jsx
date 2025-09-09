import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from "../../constants/api.js"; 
import { useNavigate } from 'react-router-dom';
import './maquinas.css';



function Maquinas() {
  const [loja, setLoja] = useState('MAX');
  const [numeroMaquina, setNumeroMaquina] = useState('');
  const [jogo, setJogo] = useState('');
  const [maquineiro, setMaquineiro] = useState('');
  const [setor, setSetor] = useState('');
  const [inicial, setInicial] = useState('');
  const [final, setFinal] = useState('');
  const [valor, setValorJogo] = useState('');
  const [lojas, setLojas] = useState([]);
  const [jogos, setJogos] = useState([]);
  const navigate = useNavigate();



  // 🔄 Buscar lojas e jogos da API (porta 3001)
  useEffect(() => {
    async function fetchData() {
      try {
        const [resLojas, resJogos] = await Promise.all([
          api.get("/lojas"),
          api.get("/jogos"),
        ]);
        setLojas(resLojas.data);
        setJogos(resJogos.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const maquina = {
      loja,
      numeroMaquina,
      jogo,
      valor,
      maquineiro,
      setor,
      inicial,
      final,
    };

    try {
      await api.post("/maquinas", maquina);
      alert("Máquina cadastrada com sucesso!");
      setLoja('');
      setNumeroMaquina('');
      setJogo('');
      setMaquineiro('');
      setSetor('');
      setInicial('');
      setFinal('');
      setValorJogo('');
    } catch (error) {
      console.error("Erro ao cadastrar máquina:", error);
      alert("Erro ao cadastrar máquina");
    }
  };


  return (
    <div className="containerMaquina">
      <h1>Cadastro de Máquinas</h1>
      <form onSubmit={handleSubmit}>
       <div className="colunaMaquina">

<label>Loja:</label>
<select className='inpuCaixaSelectMaquina'
  value={loja}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setLoja(nomeSelecionado);
    const jogoSelecionado = lojas.find(j => j.loja === nomeSelecionado);
    if (jogoSelecionado) {
      setValorJogo(jogoSelecionado.valor);
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

  <label>Número da Máquina:</label>
  <input className='inpuCaixaMaquina' type="text" value={numeroMaquina} onChange={(event) => setNumeroMaquina(event.target.value)} />

           
<label>Jogo:</label>
<select className='inpuCaixaSelectMaquina'
  value={jogo}
  onChange={(event) => {
    const nomeSelecionado = event.target.value;
    setJogo(nomeSelecionado);
    const jogoSelecionado = jogos.find(j => j.nomedojogo === nomeSelecionado);
    if (jogoSelecionado) {
      setValorJogo(jogoSelecionado.valor);
    }
  }}
>
  <option value=""></option>
  {jogos && jogos.map((j) => (
    <option key={j.id || j.nomedojogo} value={j.nomedojogo}>
      {j.nomedojogo} {j.valor}
    </option>
  ))}
</select>
            <label>Maquineiro:</label>
            <input className='inpuCaixaMaquina' type="text" value={maquineiro} onChange={(event) => setMaquineiro(event.target.value)} />
          

            <label>Setor:</label>
            <input className='inpuCaixaMaquina' type="text" value={setor} onChange={(event) => setSetor(event.target.value)} />
            <label>Entrada:</label>
            <input className='inpuCaixaMaquina' type="number" value={inicial} onChange={(event) => setInicial(event.target.value)} />
            <label>Saída:</label>
            <input className='inpuCaixaMaquina' type="number" value={final} onChange={(event) => setFinal(event.target.value)} />
         
       
        <div className='btn-abrirMaquina'>
          <button className='btn-salvar'  type="submit">Salvar</button>
         
          <button className='btn-voltar' type="button" onClick={() => navigate('/app/cadastros')}>Voltar</button>
         </div>
  </div> 
        
      </form>
    </div>
  );
}
export default Maquinas;

        

        
