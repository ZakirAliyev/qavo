import "./index.scss";
import { useRef, useEffect, useState } from "react";

function HeroPortfolioDetails() {
    const letters = "KANDAR".split("");
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

    // Mouse move animasyonu: harflerin scaleY değeri mouse'a göre değişiyor.
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

    // Scroll ile konum ve ölçek animasyonu: scale transform'u ile font boyutu küçülüyor
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Scroll etkisinin tamamlanacağı mesafe (threshold) – isteğe göre ayarlayabilirsiniz
            const threshold = window.innerHeight * 1.25;
            const progress = Math.min(scrollY / threshold, 1);

            // Örneğin; metni biraz sola ve aşağı kaydırıyoruz
            const translateX = -35 * progress; // vw cinsinden
            const translateY = 50 * progress;  // vh cinsinden

            // Ölçek: progress 0 iken scale 1, progress 1 iken scale 0.5 olacak şekilde
            const scaleFactor = 1 - 0.5 * progress;

            if (nameContainerRef.current) {
                // Hem translate hem de scale aynı anda uygulanıyor.
                nameContainerRef.current.style.transform = `translate(${translateX}vw, ${translateY}vh) scale(${scaleFactor})`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="heroPortfolioDetails">
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
            {isAnimating && <div className="transition-overlay1"></div>}
        </section>
    );
}

export default HeroPortfolioDetails;
