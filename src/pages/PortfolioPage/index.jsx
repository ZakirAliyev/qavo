import {useState, useEffect} from 'react';
import Navbar from "../../components/CommonComponents/Navbar/index.jsx";
import Footer from "../../components/CommonComponents/Footer/index.jsx";
import BurgerMenu from "../../components/CommonComponents/BurgerMenu/index.jsx";
import HeroPortfolio from "../../components/PortfolioComponents/HeroPortfolio/index.jsx";
import {useParams} from "react-router";
import HeroBottomPortfolio from "../../components/PortfolioComponents/HeroBottomPortfolio/index.jsx";
import FolderPortfolio from "../../components/PortfolioComponents/FolderPortfolio/index.jsx";
import Information from "../../components/CommonComponents/Information/index.jsx";
import OurTeamTitle from "../../components/CommonComponents/OurTeamTitle/index.jsx";

function PortfolioPage() {
    const [, setDisplay] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerClosing, setIsBurgerClosing] = useState(false);
    const params = useParams();
    const portfolioName = params?.name

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplay(false);
        }, 3500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isBurgerOpen || isBurgerClosing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isBurgerOpen, isBurgerClosing]);

    const handleBurgerToggle = () => {
        if (isBurgerOpen && !isBurgerClosing) {
            setIsBurgerClosing(true);
        } else if (!isBurgerOpen) {
            setIsBurgerOpen(true);
        }
    };

    const handleBurgerAnimationEnd = () => {
        if (isBurgerClosing) {
            setIsBurgerOpen(false);
            setIsBurgerClosing(false);
        }
    };

    return (
        <section id="portfolioPage">
            <Navbar
                onToggleBurger={handleBurgerToggle}
                isBurgerOpen={isBurgerOpen}
            />
            <HeroPortfolio portfolioName={portfolioName}/>
            <HeroBottomPortfolio/>
            <FolderPortfolio portfolioName={portfolioName}/>
            <Information/>
            <OurTeamTitle/>
            <Footer/>
            {isBurgerOpen && (
                <BurgerMenu
                    isClosing={isBurgerClosing}
                    onAnimationEnd={handleBurgerAnimationEnd}
                    onClose={handleBurgerToggle}
                />
            )}
        </section>
    );
}

export default PortfolioPage;
