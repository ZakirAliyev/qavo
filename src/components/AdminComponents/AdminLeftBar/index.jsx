import './index.scss';
import image1 from "/src/assets/qavoCodesLogo.png";
import {useNavigate} from "react-router-dom";
import {useLocation} from "react-router";
import {FaBorderAll} from "react-icons/fa";
import {IoCodeSlash} from "react-icons/io5";
import {MdSupportAgent} from "react-icons/md";
import {PiSpinnerBallLight, PiStudent} from "react-icons/pi";
import {GiTeamIdea} from "react-icons/gi";
import {AiOutlineTeam} from "react-icons/ai";

function AdminLeftBar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isPortfolioSelected = location.pathname === '/cp/dashboard/portfolio';
    const isAgencyPortfolioSelected = location.pathname === '/cp/dashboard/agency-portfolio';
    const isTeamMemberSelected = location.pathname === '/cp/dashboard/team-member';
    const isSpin = location.pathname === '/cp/dashboard/spin';
    const isBrandSelected = location.pathname === '/cp/dashboard/brands';

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
                        <IoCodeSlash className={"iconZakir"}/>
                        <span>Qavo Codes</span>
                    </div>
                    <div
                        className={`route ${isAgencyPortfolioSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/agency-portfolio')}
                    >
                        <MdSupportAgent className={"iconZakir"}/>
                        <span>Qavo Agency</span>
                    </div>
                    <div
                        className={`route ${isTeamMemberSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/team-member')}
                    >
                        <AiOutlineTeam className={"iconZakir"}/>
                        <span>Team member</span>
                    </div>
                    <div
                        className={`route ${isBrandSelected ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/brands')}
                    >
                        <AiOutlineTeam className={"iconZakir"}/>
                        <span>Brendlər</span>
                    </div>
                    <div
                        className={`route ${isSpin ? 'selected' : ''}`}
                        onClick={() => navigate('/cp/dashboard/spin')}
                    >
                        <PiSpinnerBallLight className={"iconZakir"}/>
                        <span>Spin</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminLeftBar;