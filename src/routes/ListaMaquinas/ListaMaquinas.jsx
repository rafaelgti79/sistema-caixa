import { useFetch } from '../hooks/useFetch';
import './ListaMaquinas.css';

const url = "http://localhost:3000/maquinas";

function ListaMaquinas() {
const {data: items} = useFetch(url)


  return (
    <div className="table-container">
      <h1>LISTA MAQUINAS</h1>

      <table className="excel-table">
  <thead>
    <tr>
      <th>N</th>
      <th>EI</th>
      <th>SI</th>
      <th>JOGO</th>
      <th>$</th>
      <th>ST</th>
      <th>MAQNRO</th>
      <th>%</th>
    </tr>
  </thead>
  <tbody>
    {items && items.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>{item.entrada}</td>
        <td>{item.saida}</td>
        <td>{item.jogo}</td>
        <td>{item.valorJogo}</td>
        <td>{item.setor}</td>
        <td>{item.MAQNRO}</td>
        <td>{item.percentual}0%</td>
      </tr>
    ))}
  </tbody>
</table>

</div>
     
  );
}
export default ListaMaquinas;
           


        
