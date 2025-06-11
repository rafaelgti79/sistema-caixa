import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    return(
        <div className="containerNav">
            <Link to="/">Home</Link>
        </div>
    );
};

export default Navbar;