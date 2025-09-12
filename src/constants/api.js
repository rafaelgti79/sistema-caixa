import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/"
});

export default api;


let dataOperacional = new Date().toISOString().split('T')[0];

if (caixaAberto?.createdAt) {
  const dataAbertura = new Date(caixaAberto.createdAt); // ou caixaAberto.dataAbertura se for esse o nome
  const hoje = new Date();

  const aberturaDia = dataAbertura.getDate();
  const hojeDia = hoje.getDate();

  const aberturaMes = dataAbertura.getMonth();
  const hojeMes = hoje.getMonth();

  const aberturaAno = dataAbertura.getFullYear();
  const hojeAno = hoje.getFullYear();

  // Verifica se a abertura foi no dia anterior
  const aberturaFoiOntem =
    aberturaAno === hojeAno &&
    aberturaMes === hojeMes &&
    aberturaDia === hojeDia - 1;

  if (aberturaFoiOntem) {
    dataOperacional = dataAbertura.toISOString().split('T')[0];
  }
}

const dataOperacional = caixaAberto.createdAt.split('T')[0];

await api.post('/historicocaixa', {
  usuario: usuarioLogado.nome,
  data: dataOperacional,
  caixaId: caixaAberto.id,
  ...
});

