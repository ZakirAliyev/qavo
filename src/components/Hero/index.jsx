import "./index.scss";
import { useRef, useEffect } from "react";

function Hero() {
    const letters = "QAVO".split("");
    const nameContainerRef = useRef(null);
    const spanRefs = useRef([]);
    spanRefs.current = [];

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

    return (
        <section id="hero">
            <div className="name" ref={nameContainerRef}>
                {letters.map((letter, index) => (
                    <span
                        key={index}
                        ref={addToRefs}
                        style={{ animationDelay: `${index * 0.1}s` }}
                        className="wave-letter"
                        onAnimationEnd={(e) => e.target.classList.remove("wave-letter")}
                    >
            {letter}
          </span>
                ))}
            </div>
            <div className="description">
                WE ARE A CREATIVE STUDIO, SPECIALIZED IN STRATEGY, BRANDING <br />
                DESIGN, AND DEVELOPMENT. OUR WORK IS ALWAYS AT THE INTERSECTION <br />
                OF DESIGN AND TECHNOLOGY.
            </div>
        </section>
    );
}

export default Hero;
