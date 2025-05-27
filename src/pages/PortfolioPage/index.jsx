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
import AccordionMenu from "../../components/CommonComponents/AccordionMenu/index.jsx";
import AnimatedCursor from "react-animated-cursor";
import {useNavigate} from "react-router-dom";

function PortfolioPage() {
    const [, setDisplay] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerClosing, setIsBurgerClosing] = useState(false);
    const params = useParams();
    const portfolioName = params?.name
    const navigate = useNavigate();

    useEffect(() => {
        const allowedNames = ["qavo-codes", "qavo-agency"];
        if (portfolioName && !allowedNames.includes(portfolioName)) {
            navigate('/error');
        }
    }, [portfolioName, navigate]);

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

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        const debounceResize = debounce(handleResize, 200);
        window.addEventListener("resize", debounceResize);

        const audio = document.getElementById("background-audio");
        if (audio) {
            audio.loop = true;
            audio.play().catch((err) => {
                console.warn("Autoplay prevented by browser:", err);
            });
        }

        return () => window.removeEventListener("resize", debounceResize);
    }, []);

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };


    return (
        <section id="portfolioPage">
            {!isMobile && (
                <AnimatedCursor
                    innerSize={8}
                    outerSize={40}
                    color="255,255,255, 0"
                    outerAlpha={0.3}
                    innerScale={1}
                    outerScale={2}
                    outerStyle={{
                        border: "2px solid rgb(255,255,255)",
                        borderRadius: "50%",
                    }}
                    innerStyle={{
                        backgroundColor: "rgb(255,255,255)",
                        borderRadius: "50%",
                    }}
                    clickables={[
                        'a',
                        'Link',
                        'h2',
                        'input[type="text"]',
                        'input[type="email"]',
                        'input[type="number"]',
                        'input[type="submit"]',
                        'input[type="image"]',
                        'label[for]',
                        'select',
                        'textarea',
                        'button',
                        '.link',
                        {
                            target: '.custom',
                            options: {
                                innerSize: 12,
                                outerSize: 12,
                                color: '255, 255, 255',
                                outerAlpha: 0.3,
                                innerScale: 0.7,
                                outerScale: 5,
                            },
                        },
                    ]}
                />
            )}
            <Navbar
                onToggleBurger={handleBurgerToggle}
                isBurgerOpen={isBurgerOpen}
            />
            <HeroPortfolio portfolioName={portfolioName}/>
            <HeroBottomPortfolio/>
            <FolderPortfolio portfolioName={portfolioName}/>
            <AccordionMenu/>
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
