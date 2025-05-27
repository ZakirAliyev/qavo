import {useState, useEffect} from 'react';
import Navbar from "../../components/CommonComponents/Navbar/index.jsx";
import Hero from "../../components/HomeComponents/Hero/index.jsx";
import HeroBottom from "../../components/HomeComponents/HeroBottom/index.jsx";
import Folder from "../../components/HomeComponents/Folder/index.jsx";
import StartScene from "../../components/HomeComponents/StartScene/index.jsx";
import Crafting from "../../components/HomeComponents/Crafting/index.jsx";
import Skills from "../../components/HomeComponents/Skills/index.jsx";
import Information from "../../components/CommonComponents/Information/index.jsx";
import OurTeamTitle from "../../components/CommonComponents/OurTeamTitle/index.jsx";
import Footer from "../../components/CommonComponents/Footer/index.jsx";
import BurgerMenu from "../../components/CommonComponents/BurgerMenu/index.jsx";
import AnimatedCursor from "react-animated-cursor";
import LogoScroll from "../../components/CommonComponents/LogoScroll/index.jsx";

function HomePage() {
    const [display, setDisplay] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerClosing, setIsBurgerClosing] = useState(false);

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
        <section id="homePage">
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
            {display ? (
                <StartScene/>
            ) : (
                <>
                    <Navbar
                        onToggleBurger={handleBurgerToggle}
                        isBurgerOpen={isBurgerOpen}
                    />
                    <Hero/>
                    <HeroBottom/>
                    <LogoScroll/>
                    <Crafting/>
                    <Skills/>
                    <Folder/>
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
                </>
            )}
        </section>
    );
}

export default HomePage;
