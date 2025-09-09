import './App.css'
import { Outlet, useLocation  } from 'react-router-dom'
import Navbar from './components/Navbar'



function App() {
  const location = useLocation();

  // Rotas onde a Navbar NÃO deve aparecer
  const rotasSemNavbar = [
    '/app/home-caixa',
    '/app/tela-de-caixa',
    '/app/login',
    '/app/tela-admin',
    '/app/despesas-extra',
    '/app/reforco'
  ];

  const esconderNavbar = rotasSemNavbar.includes(location.pathname);

   return (
    <>
      {!esconderNavbar && <Navbar />}
      <Outlet />
    </>
  );
}

export default App;