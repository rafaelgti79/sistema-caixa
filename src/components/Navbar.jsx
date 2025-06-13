import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import './Navbar.css';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
