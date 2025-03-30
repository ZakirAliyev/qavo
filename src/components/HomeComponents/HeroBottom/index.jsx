import "./index.scss";
import Title from "../../CommonComponents/Title/index.jsx";
import { HiMiniChevronDown } from "react-icons/hi2";

function HeroBottom() {

    function handleScroll() {
        window.scrollTo({ top: window.innerHeight - 50, behavior: "smooth" });
    }

    return (
        <section id="heroBottom">
            <div className="title">
                <div className="titleWrapper">
                    <Title title="Sürüştür Və Kəşf Et" />
                    <HiMiniChevronDown className="icon" onClick={handleScroll} />
                </div>
                <Title title="Seçilmiş layihələr" />
            </div>
        </section>
    );
}

export default HeroBottom;
