import "./index.scss";
import {useRef, useEffect, useState} from "react";
import Title from "../../CommonComponents/Title/index.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useNavigate} from "react-router";

function InformationPortfolioDetails({project}) {

    const letters = "DETAILS".toUpperCase().split("");
    const nameContainerRef = useRef(null);
    const spanRefs = useRef([]);
    spanRefs.current = [];

    AOS.init({
        duration: 1000
    });

    const [isAnimating, setIsAnimating] = useState(false);

    const addToRefs = (el) => {
        if (el && !spanRefs.current.includes(el)) {
            spanRefs.current.push(el);
        }
    };

    const maxDelta = 0.3;
    const effectRange = 150;

    const smoothstep = (t) => {
        const clamped = Math.max(0, Math.min(1, t));
        return clamped * clamped * (3 - 2 * clamped);
    };

    useEffect(() => {
        const container = nameContainerRef.current;

        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            spanRefs.current.forEach((span) => {
                const rect = span.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - centerX);
                let factor = 0;
                if (distance < effectRange) {
                    factor = 1 - distance / effectRange;
                    factor = smoothstep(factor);
                }
                const scale = 1 + maxDelta * factor;
                span.style.transform = `scaleY(${scale})`;
            });
        };

        const handleMouseLeave = () => {
            spanRefs.current.forEach((span) => {
                span.style.transform = "scaleY(1)";
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // Overlay animasyonu: bileşen yüklendiğinde kısa süreli kaplama
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const navigate = useNavigate();

    return (
        <section id="informationPortfolioDetails">
            <div className="name" ref={nameContainerRef}>
                {letters && letters.map((letter, index) => (
                    <span
                        key={index}
                        ref={addToRefs}
                        style={{animationDelay: `${index * 0.1}s`}}
                        className="wave-letter"
                        onAnimationEnd={(e) => e.target.classList.remove("wave-letter")}
                    >
            {letter}
          </span>
                ))}
            </div>
            <div className="description" data-aos={"fade-right"}>LAYİHƏ HAQQINDA QISA MƏLUMAT</div>
            <div className={"info"}>
                <div className={"row"}>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <div className={"box10"} data-aos={"fade-down"}>
                            {project?.subTitle}
                        </div>
                    </div>
                    <div className={"col-6 col-md-6 col-sm-12 col-xs-12"}>
                        <div className={"box10"}>
                            <div className={"span"} data-aos={"fade-right"}>TARİX</div>
                            <span data-aos={"fade-right"}>Yanvar {project?.productionDate}</span>
                            <div className={"span span1"} data-aos={"fade-right"}>ƏMƏKDAŞLIQ</div>
                            <span data-aos={"fade-right"}>{project?.role}</span>

                            <div className={"span span1 span2"} data-aos={"fade-right"}
                                 onClick={() => window.location.href = `${project?.vebSiteLink}`}>
                                [<Title title={"WEBSAYTA KEÇİN"}/>]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default InformationPortfolioDetails;