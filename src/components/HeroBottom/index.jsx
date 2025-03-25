import "./index.scss";
import Title from "../Title/index.jsx";

function HeroBottom() {
    return (
        <section id="heroBottom">
            <div className={"title"}>
                <Title title={"Scroll to Explore"}/>
                <Title title={"Featured Projects"}/>
            </div>
        </section>
    );
}

export default HeroBottom;
