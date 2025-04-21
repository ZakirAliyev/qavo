import "./index.scss";
import {useEffect, useRef, useState} from "react";
import Title from "../../CommonComponents/Title/index.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function Crafting() {
    const descriptionRef = useRef(null);
    const [animate, setAnimate] = useState(false);
    AOS.init({
        duration: 1000
    });
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
            <div className={`description`}>
                <div data-aos={"fade-left"}>DİZAYN SADƏCƏ GÖRÜNÜŞ DEYİL</div>
                <div data-aos={"fade-right"}>O, RUHUN ZÖVQLƏ DANIŞDIĞI DİLDİR.</div>
            </div>
            <button>
                <div className={"title"}>
                    <Title title={"Xidmət sahələrimiz"}/>
                </div>
            </button>
        </section>
    );
}

export default Crafting;
