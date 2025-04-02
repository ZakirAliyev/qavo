import './index.scss'
import {useLocation, useNavigate} from "react-router";
import image2 from "../../assets/qavoCodesLogo.png";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {useState} from "react";
import {CiLogout} from "react-icons/ci";
import AdminLeftBar from "../../components/AdminComponents/AdminLeftBar/index.jsx";
import {Helmet} from "react-helmet-async";
import Cookies from "js-cookie";
import AdminPortfolio from "../../components/AdminComponents/AdminPortfolioCodes/index.jsx";
import AdminPortfolioAgency from "../../components/AdminComponents/AdminPortfolioAgency/index.jsx";

function AdminPage() {
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    const navigate = useNavigate();

    return (
        <section id="adminPage">
            <Helmet>
                <title>Admin Panel - QavoCodes</title>
            </Helmet>
            <AdminLeftBar/>
            <div className="wrapper">
                <div className="topClass">
                    <div className="profile">
                        <button onClick={toggleDropdown}>
                            {dropdownOpen ? <FaChevronUp/> : <FaChevronDown/>}
                        </button>
                        <span>Admin</span>
                        <img src={image2} alt="Profile"/>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <button onClick={() => {
                                    Cookies.set("colorStormToken", "null")
                                    Cookies.set("colorStormRole", "null")
                                    navigate('/')
                                }}>
                                    <CiLogout style={{
                                        color: 'red'
                                    }}/>
                                    <span style={{
                                        color: 'red'
                                    }}>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {location.pathname === "/cp/dashboard/portfolio" ? (
                    // <Products/>
                    <AdminPortfolio/>
                ) : location.pathname === "/cp/dashboard/agency-portfolio" ? (
                    // <Services/>
                    <AdminPortfolioAgency/>
                ) : location.pathname === "/cp/dashboard/brands" ? (
                    // <Brands/>
                    <></>
                ) : location.pathname === "/cp/dashboard/categories" ? (
                    // <Categories/>
                    <></>
                ) : location.pathname === "/cp/dashboard/banners" ? (
                    // <Banners/>
                    <></>
                ) : location.pathname === "/cp/dashboard/orders" ? (
                    // <Orders/>
                    <></>
                ) : location.pathname === "/cp/dashboard/portfolios" ? (
                    // <PortfoliosPanel/>
                    <></>
                ) : null}
            </div>
        </section>
    );
}

export default AdminPage;