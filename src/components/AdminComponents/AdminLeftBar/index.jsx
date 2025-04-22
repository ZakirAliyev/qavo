import './index.scss';
import image1 from "/src/assets/qavoCodesLogo.png";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";
import {FaBorderAll} from "react-icons/fa";

function AdminLeftBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isPortfolioSelected = location.pathname === '/cp/dashboard/portfolio';
    const isAgencyPortfolioSelected = location.pathname === '/cp/dashboard/agency-portfolio';
    const isAcademyPortfolioSelected = location.pathname === '/cp/dashboard/academy-portfolio';
    const isTeamMemberSelected = location.pathname === '/cp/dashboard/team-member';

    return (
        <section id={"adminLeftBar"}>
            <div>
                <div className={"img"}>
                    <img src={image1} alt={"Image"}/>
                </div>
                <div className={"routeWrapper"}>
                    <div
                        className={`route ${isPortfolioSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/portfolio')}
                    >
                        <FaBorderAll/>
                        <span>Qavo Codes</span>
                    </div>
                    <div
                        className={`route ${isAgencyPortfolioSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/agency-portfolio')}
                    >
                        <FaBorderAll/>
                        <span>Qavo Agency</span>
                    </div>
                    <div
                        className={`route ${isAcademyPortfolioSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/academy-portfolio')}
                    >
                        <FaBorderAll/>
                        <span>Qavo Academy</span>
                    </div>
                    <div
                        className={`route ${isTeamMemberSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/team-member')}
                    >
                        <FaBorderAll/>
                        <span>Team member</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminLeftBar;