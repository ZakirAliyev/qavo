import {useState, useEffect} from 'react';
import Navbar from "../../components/CommonComponents/Navbar/index.jsx";
import Footer from "../../components/CommonComponents/Footer/index.jsx";
import BurgerMenu from "../../components/CommonComponents/BurgerMenu/index.jsx";
import {useParams} from "react-router";
import HeroPortfolioDetails from "../../components/PortfolioDetailsComponents/HeroPortfolioDetails/index.jsx";

function PortfolioDetailsPage() {
    const [, setDisplay] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerClosing, setIsBurgerClosing] = useState(false);
    const params = useParams();
    console.log(params);

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
        <section id="portfolioDetailsPage">
            <Navbar
                onToggleBurger={handleBurgerToggle}
                isBurgerOpen={isBurgerOpen}
            />
            <HeroPortfolioDetails/>
            <HeroPortfolioDetails/>
            <HeroPortfolioDetails/>
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

export default PortfolioDetailsPage;
