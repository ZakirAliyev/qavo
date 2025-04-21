import { useEffect, useRef } from "react";
import "./index.scss";

function Skills() {
    const skills = [
        "WEB DİZAYN",
        "MOBİL TƏTBİQ HAZIRLANMASI",
        "UI/UX DİZAYNI",
        "SEO OPTİMİZASYASI",
        "SOSİAL MEDİA İDARƏETMƏSİ",
        "DATA ANALİTİKASI",
        "MƏZMUNUN YARADICILIĞI"
    ];

    const skillRefs = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            const centerY = window.innerHeight / 2;
            skillRefs.current.forEach((ref) => {
                if (ref) {
                    const rect = ref.getBoundingClientRect();
                    const elementCenter = rect.top + rect.height / 2;
                    if (elementCenter <= centerY) {
                        ref.style.color = "white";
                    } else {
                        ref.style.color = "#252525";
                    }
                }
            });
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section id="skills">
            {skills.map((skill, index) => (
                <div
                    key={index}
                    className="skill"
                    ref={(el) => (skillRefs.current[index] = el)}
                >
                    {skill}
                </div>
            ))}
        </section>
    );
}

export default Skills;
