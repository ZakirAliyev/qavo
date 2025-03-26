import Navbar from "../../components/Navbar/index.jsx";
import Hero from "../../components/Hero/index.jsx";
import HeroBottom from "../../components/HeroBottom/index.jsx";
import {useState, useEffect} from 'react';
import Folder from "../../components/Folder/index.jsx";
import StartScene from "../../components/StartScene/index.jsx";
import Crafting from "../../components/Crafting/index.jsx";
import Skills from "../../components/Skills/index.jsx";
import Information from "../../components/Information/index.jsx";
import OurTeamTitle from "../../components/OurTeamTitle/index.jsx";

function HomePage() {
    const [display, setDisplay] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplay(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="homePage">
            {/*<div style={{display: display ? "block" : "none"}}>*/}
            {/*    <StartScene/>*/}
            {/*</div>*/}
            {/*<div style={{display: display ? "none" : "block"}}>*/}
                <Navbar/>
                <Hero/>
                <HeroBottom/>
                <Folder/>
                <Crafting/>
                <Skills/>
                <Information/>
                <OurTeamTitle/>
            {/*</div>*/}
        </section>
    );
}

export default HomePage;
