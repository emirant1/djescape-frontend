import './Nav.css';
import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <nav>
            <span>NO ESCAPIN' THIS</span>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>Pictures</li>
                <li>References</li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;