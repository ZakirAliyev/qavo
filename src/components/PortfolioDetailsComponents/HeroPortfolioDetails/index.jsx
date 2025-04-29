import "./index.scss";
import { useRef, useEffect, useState } from "react";

function HeroPortfolioDetails({ project }) {
    const letters = project?.title.toUpperCase().split("");
    const nameContainerRef = useRef(null);
    const spanRefs = useRef([]);
    spanRefs.current = [];

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

    // Mouse move animation: Letters' scaleY changes based on mouse position
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

    // Overlay animation: Temporary overlay on component load
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Truncate subtitle up to the first period
    const truncatedSubtitle = project?.subTitle
        ? project.subTitle.split(".")[0] + (project.subTitle.includes(".") ? "." : "")
        : "";

    return (
        <section id="heroPortfolioDetails">
            <div className="name" ref={nameContainerRef}>
                {letters &&
                    letters.map((letter, index) => (
                        <span
                            key={index}
                            ref={addToRefs}
                            style={{
                                animationDelay: `${index * 0.1}s`,
                            }}
                            className={`wave-letter ${letter === " " ? "space" : ""}`}
                            onAnimationEnd={(e) => e.target.classList.remove("wave-letter")}
                        >
                            {letter === " " ? "\u00A0" : letter}
                        </span>
                    ))}
            </div>
            <div className="description">{truncatedSubtitle}</div>
            {isAnimating && <div className="transition-overlay1"></div>}
        </section>
    );
}

export default HeroPortfolioDetails;