import "./index.scss";
import Title from "../../CommonComponents/Title/index.jsx";
import { HiMiniChevronDown } from "react-icons/hi2";

function HeroBottomPortfolio() {

    function handleScroll() {
        window.scrollTo({ top: window.innerHeight - 50, behavior: "smooth" });
    }

    return (
        <section id="heroBottomPortfolio">
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

export default HeroBottomPortfolio;
