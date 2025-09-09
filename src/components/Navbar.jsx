import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

//estensão para esconder o navbar
import { useLocation } from "react-router-dom";

import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

//estensão para esconder o navbar
  const location = useLocation();

   // Ocultar Navbar nas rotas de login ou cadastro
  const rotasSemNavbar = [
    "/", 
    "/app/fecharCaixa",
    "/app/despesas",
    "/app/reforco",
    "/app/cartoes",
    "/app/dinheiro",
    "/app/cartao",
    "/app/fechamentomaquinas",
    "/app/fechamento/final",
    "/app/sangria",
    "/app/fechamentoindividual"
  ];
  if (rotasSemNavbar.includes(location.pathname)) {
    return null; // Não renderiza o navbar
  }

  const handleLogout = () => {
    logout(); // Limpa a autenticação
    navigate("/"); // Redireciona para o login ("/" é a tela de login)
  };

  return (
    <div className="containerNav">
      <Link className="linkHome" to="/app/home">Home</Link>
      <button className="bntSair" onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default Navbar;
