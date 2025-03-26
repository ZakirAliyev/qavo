import "./index.scss";
import {useEffect, useRef, useState} from "react";
import Title from "../Title/index.jsx";

function Crafting() {
    const descriptionRef = useRef(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setAnimate(true);
                    observer.unobserve(entry.target);
                }
            },
            {threshold: 0.1}
        );

        if (descriptionRef.current) {
            observer.observe(descriptionRef.current);
        }
        return () => {
            if (descriptionRef.current) {
                observer.unobserve(descriptionRef.current);
            }
        };
    }, []);

    return (
        <section id="crafting">
            <div ref={descriptionRef} className={`description ${animate ? 'animate' : ''}`}>
                <div>CRAFTING WEBSITES WHERE THE ELEGANCE</div>
                <div>OF DESIGN INTERSECTS WITH THE SCIENCE SELLING PRODUCTS.</div>
            </div>
            <button>
                <div className={"title"}>
                    <Title title={"See All Works"}/>
                </div>
            </button>
        </section>
    );
}

export default Crafting;
