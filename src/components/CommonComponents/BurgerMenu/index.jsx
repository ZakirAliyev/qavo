import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import "./index.scss";
import Title1 from "../Title1/index.jsx";

function BurgerMenu({ isClosing, onAnimationEnd, onClose }) {
    const [showWave, setShowWave] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [computedFontSize, setComputedFontSize] = useState("125px");

    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    // Font size calculation based on window width
    const updateFontSize = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth <= 400) {
            setComputedFontSize("80px");
            return;
        }
        if (currentWidth <= 430) {
            setComputedFontSize("100px");
            return;
        }
        const baseWidth = 1920;
        const baseFontSize = 125;
        let scale = currentWidth / baseWidth;
        let newSize = baseFontSize * scale;
        if (newSize < 80) newSize = 80;
        setComputedFontSize(`${newSize}px`);
    };

    useEffect(() => {
        updateFontSize();
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWave(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const titles = [
        { text: "QAVO CODES", path: "/portfolio/qavo-codes" },
        { text: "QAVO AGENCY", path: "/portfolio/qavo-agency" },
        { text: "QAVO ACADEMY", path: "/portfolio/qavo-academy" },
        { text: "BİZİM KOMANDA", path: "/our-team" },
        { text: "ƏLAQƏ", path: "/contact" },
    ];

    const handleNavigation = (path) => {
        navigate(path);
        onClose(); // Close the burger menu after navigation
    };

    return (
        <section
            id="burgerMenu"
            className={isClosing ? "closing" : ""}
            onAnimationEnd={() => {
                if (isClosing) {
                    onAnimationEnd();
                }
            }}
        >
            {showWave && (
                <div className="wave-text">
                    {titles.map((item, index) => (
                        <p
                            key={item.text}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleNavigation(item.path)}
                            style={{ cursor: "pointer" }}
                        >
                            <Title1
                                title={item.text}
                                fontSize={computedFontSize}
                                fontFamily={"'Credit Block', sans-serif"}
                                selected={location.pathname === item.path} // Set selected based on current path
                            />
                        </p>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BurgerMenu;