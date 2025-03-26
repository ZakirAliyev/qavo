import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbar/index.jsx";
import Hero from "../../components/Hero/index.jsx";
import HeroBottom from "../../components/HeroBottom/index.jsx";
import Folder from "../../components/Folder/index.jsx";
import StartScene from "../../components/StartScene/index.jsx";
import Crafting from "../../components/Crafting/index.jsx";
import Skills from "../../components/Skills/index.jsx";
import Information from "../../components/Information/index.jsx";
import OurTeamTitle from "../../components/OurTeamTitle/index.jsx";
import Footer from "../../components/Footer/index.jsx";
import BurgerMenu from "../../components/BurgerMenu/index.jsx";

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

    // Disable scroll when burger menu open or closing
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
        <section id="homePage">
            {display ? (
                <StartScene />
            ) : (
                <>
                    <Navbar
                        onToggleBurger={handleBurgerToggle}
                        isBurgerOpen={isBurgerOpen}
                    />
                    <Hero />
                    <HeroBottom />
                    <Folder />
                    <Crafting />
                    <Skills />
                    <Information />
                    <OurTeamTitle />
                    <Footer />
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
