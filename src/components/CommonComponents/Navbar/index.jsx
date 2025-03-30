import './index.scss';
import logo from '/src/assets/qavoCodesLogo.png';
import {FaBars, FaTimes as FaCross} from "react-icons/fa";
import Title from "../Title/index.jsx";
import {useNavigate} from "react-router";

function Navbar({onToggleBurger, isBurgerOpen}) {

    const navigate = useNavigate()

    return (
        <section id="navbar">
            <img src={logo} alt="Logo" onClick={() => navigate('/')}/>
            <div className="links" onClick={onToggleBurger}>
                <div className="link">
                    <Title title={"Menyu"}/>
                </div>
                {/* Render FaCross if burger menu is open; otherwise, render FaBars */}
                {isBurgerOpen ? <FaCross className="link"/> : <FaBars className="link"/>}
            </div>
        </section>
    );
}

export default Navbar;
