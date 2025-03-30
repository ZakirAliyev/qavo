import './index.scss';
import {useEffect, useRef, useState} from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

function ContactTitle() {
    const letters = "CONTACT".split("");
    const nameContainerRef = useRef(null);
    const spanRefs = useRef([]);
    spanRefs.current = [];

    AOS.init({
        duration: 1000
    });

    const addToRefs = (el) => {
        if (el && !spanRefs.current.includes(el)) {
            spanRefs.current.push(el);
        }
    };

    const maxDelta = 0.175;
    const effectRange = 150;

    const smoothstep = (t) => {
        const clamped = Math.max(0, Math.min(1, t));
        return clamped * clamped * (3 - 2 * clamped);
    };

    // Custom cursor state’leri
    const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
    const [cursorHover, setCursorHover] = useState(false);

    // Letter animasyonu için IntersectionObserver
    useEffect(() => {
        const container = nameContainerRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        spanRefs.current.forEach((span, index) => {
                            span.classList.add("wave-letter");
                            span.style.animationDelay = `${index * 0.1}s`;
                        });
                    }
                });
            },
            {threshold: 0.1}
        );
        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Fare hareketine bağlı harf efekti
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

    // Custom cursor için: fare pozisyonunu takip et
    useEffect(() => {
        const container = nameContainerRef.current;

        const handleCursorMove = (e) => {
            setCursorPos({x: e.clientX, y: e.clientY});
        };

        container.addEventListener("mousemove", handleCursorMove);
        return () => container.removeEventListener("mousemove", handleCursorMove);
    }, []);

    return (
        <section id="contactTitle">
            <div className="description" data-aos={"fade-up"}>
                VİZUAL VƏ İNTERAKTİV DİZAYN DÜNYASIMIZI KƏŞF EDİRİK
            </div>
            <div
                className="name"
                ref={nameContainerRef}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
            >
                {letters.map((letter, index) => (
                    <span
                        key={index}
                        ref={addToRefs}
                        onAnimationEnd={(e) => e.target.classList.remove("wave-letter")}
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </span>
                ))}
            </div>
            {/* Custom cursor elementi */}
            <div
                className={`custom-cursor ${cursorHover ? 'hovered' : ''}`}
                style={{left: cursorPos.x, top: cursorPos.y}}
            >
                {cursorHover && '[ HAQQIMIZDA ]'}
            </div>
        </section>
    );
}

export default ContactTitle;
