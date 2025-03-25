import Navbar from "../../components/Navbar/index.jsx";
import Hero from "../../components/Hero/index.jsx";
import HeroBottom from "../../components/HeroBottom/index.jsx";
import {useState, useEffect} from 'react';
import Folder from "../../components/Folder/index.jsx";
import StartScene from "../../components/StartScene/index.jsx";

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
            <div style={{display: display ? "block" : "none"}}>
                <StartScene/>
            </div>
            <div style={{display: display ? "none" : "block"}}>
            <Navbar/>
            <Hero/>
            <HeroBottom/>
            <Folder/>
            </div>
        </section>
    );
}

export default HomePage;
