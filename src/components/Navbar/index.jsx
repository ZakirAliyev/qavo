import './index.scss';
import logo from '/src/assets/qavoCodesLogo.png';
// Import FaTimes as FaCross so that it can be used as the cross icon.
import { FaBars, FaTimes as FaCross } from "react-icons/fa";
import Title from "../Title/index.jsx";

function Navbar({ onToggleBurger, isBurgerOpen }) {
    return (
        <section id="navbar">
            <img src={logo} alt="Logo" />
            <div className="links" onClick={onToggleBurger}>
                <div className="link">
                    <Title title={"Menu"} />
                </div>
                {/* Render FaCross if burger menu is open; otherwise, render FaBars */}
                {isBurgerOpen ? <FaCross className="link" /> : <FaBars className="link" />}
            </div>
        </section>
    );
}

export default Navbar;
