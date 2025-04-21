import { useState, useEffect } from "react";
import "./index.scss";
import Title from "../Title/index.jsx";
import Title1 from "../Title1/index.jsx";

function BurgerMenu({ isClosing, onAnimationEnd, onClose }) {
    const [showWave, setShowWave] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [computedFontSize, setComputedFontSize] = useState("125px");

    // Font size'ı pencere genişliğine göre hesaplayalım
    const updateFontSize = () => {
        const currentWidth = window.innerWidth;
        // iPhone 14 Pro Max benzeri küçük ekranlarda (örneğin, 430px'e kadar) 100px kullan
        if (currentWidth <= 400) {
            setComputedFontSize("80px");
            return;
        }
        if (currentWidth <= 430) {
            setComputedFontSize("100px");
            return;
        }
        const baseWidth = 1920;    // Referans ekran genişliği
        const baseFontSize = 125;  // Referans font size
        let scale = currentWidth / baseWidth;
        let newSize = baseFontSize * scale;
        // Minimum font size değeri belirleyelim
        if (newSize < 80) newSize = 80;
        setComputedFontSize(`${newSize}px`);
    };

    useEffect(() => {
        // İlk renderda hesaplama
        updateFontSize();
        // Pencere yeniden boyutlandırıldığında güncelle
        window.addEventListener("resize", updateFontSize);
        return () => window.removeEventListener("resize", updateFontSize);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowWave(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const titles = ["PORTFOLİO", "HAQQIMIZDA", "ƏLAQƏ"];

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
                    {titles.map((title, index) => (
                        <p
                            key={title}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Title1
                                title={title}
                                fontSize={computedFontSize}
                                fontFamily={"'Credit Block', sans-serif"}
                                color={hoveredIndex === index ? "white" : "#555"}
                                selected={index === 0}
                            />
                        </p>
                    ))}
                </div>
            )}
        </section>
    );
}

export default BurgerMenu;
