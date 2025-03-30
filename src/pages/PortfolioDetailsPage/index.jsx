import {useState, useEffect} from 'react';
import Navbar from "../../components/CommonComponents/Navbar/index.jsx";
import BurgerMenu from "../../components/CommonComponents/BurgerMenu/index.jsx";
import HeroPortfolioDetails from "../../components/PortfolioDetailsComponents/HeroPortfolioDetails/index.jsx";
import HeroBottomPortfolio from "../../components/PortfolioComponents/HeroBottomPortfolio/index.jsx";
import MainImagePortfolioDetails from "../../components/PortfolioDetailsComponents/MainImagePortfolioDetails/index.jsx";
import {useParams} from "react-router";
import {useGetProjectByIdQuery} from "../../services/userApi.jsx";
import InformationPortfolioDetails
    from "../../components/PortfolioDetailsComponents/InformationPortfolioDetails/index.jsx";
import VideosPortfolioDetails from "../../components/PortfolioDetailsComponents/VideosPortfolioDetails/index.jsx";
import PhotosPortfolioDetails from "../../components/PortfolioDetailsComponents/PhotosPortfolioDetails/index.jsx";
import ContactTitle from "../../components/CommonComponents/ContactTitle/index.jsx";
import Footer from "../../components/CommonComponents/Footer/index.jsx";

function PortfolioDetailsPage() {
    const [, setDisplay] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerClosing, setIsBurgerClosing] = useState(false);

    const params = useParams();
    const id = params?.id;

    const {data: getProjectById} = useGetProjectByIdQuery(id)
    const project = getProjectById?.data

    // , isLoading: getProjectByIdLoading

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
            <HeroPortfolioDetails project={project}/>
            <HeroBottomPortfolio project={project}/>
            <MainImagePortfolioDetails project={project}/>
            <InformationPortfolioDetails project={project}/>
            <PhotosPortfolioDetails project={project}/>
            <VideosPortfolioDetails project={project}/>
            <ContactTitle/>
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
