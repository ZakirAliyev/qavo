import "./index.scss";
import Title from "../Title/index.jsx";
import { HiMiniChevronDown } from "react-icons/hi2";

function HeroBottom() {

    function handleScroll() {
        window.scrollTo({ top: window.innerHeight - 50, behavior: "smooth" });
    }

    return (
        <section id="heroBottom">
            <div className="title">
                <div className="titleWrapper">
                    <Title title="Scroll to Explore" />
                    <HiMiniChevronDown className="icon" onClick={handleScroll} />
                </div>
                <Title title="Featured Projects" />
            </div>
        </section>
    );
}

export default HeroBottom;
