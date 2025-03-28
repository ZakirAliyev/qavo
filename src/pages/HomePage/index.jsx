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

function HomePage() {
    const [display, setDisplay] = useState(true);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isBurgerClosing, setIsBurgerClosing] = useState(false);

    // const {data: getAllProject} = useGetAllProjectQuery()
    // const pro = getAllProject?.data
    // console.log(pro)

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
        <section id="homePage">
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
                    <Folder/>
                    <Crafting/>
                    <Skills/>
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
