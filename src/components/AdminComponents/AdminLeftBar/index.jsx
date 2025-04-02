import './index.scss';
import image1 from "/src/assets/qavoCodesLogo.png";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";
import {FaBorderAll} from "react-icons/fa";

function AdminLeftBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isOrdersSelected = location.pathname === '/cp/dashboard/orders';

    return (
        <section id={"adminLeftBar"}>
            <div>
                <div className={"img"}>
                    <img src={image1} alt={"Image"}/>
                </div>
                <div className={"routeWrapper"}>
                    <div
                        className={`route ${isOrdersSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/portfolio')}
                    >
                        <FaBorderAll/>
                        <span>Qavo Codes</span>
                    </div>
                    <div
                        className={`route ${isOrdersSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/agency-portfolio')}
                    >
                        <FaBorderAll/>
                        <span>Qavo Agency</span>
                    </div>
                    <div
                        className={`route ${isOrdersSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/agency-portfolio')}
                    >
                        <FaBorderAll/>
                        <span>Qavo Academy</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminLeftBar;