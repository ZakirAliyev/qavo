import './index.scss'
import logo from '/src/assets/qavoCodesLogo.png';
import { FaBars } from "react-icons/fa";
import Title from "../Title/index.jsx";

function Navbar() {
    return (
        <section id="navbar">
            <img src={logo} alt="Logo"/>
            <div className="links">
                <div className="link">
                    <Title title={"Menu"}/>
                </div>
                <FaBars className="link"/>
            </div>
        </section>
    );
}

export default Navbar;
