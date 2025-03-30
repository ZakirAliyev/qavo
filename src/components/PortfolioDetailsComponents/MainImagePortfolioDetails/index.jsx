import './index.scss';
import { useState, useEffect } from "react";
import { PORTFOLIO_CARD_IMAGE_URL } from "../../../constants.js";

function MainImagePortfolioDetails({ project }) {
    const [percentage, setPercentage] = useState(35);
    const [overlayPosition, setOverlayPosition] = useState("absolute");
    const [imageOffset, setImageOffset] = useState(0);
    const [containerHeight, setContainerHeight] = useState("200vh"); // default for screens >= 400px
    const maxScroll = 1000;

    useEffect(() => {
        const handleScroll = () => {
            const viewportHeight = window.innerHeight;
            const scrollY = window.scrollY;

            if (scrollY < viewportHeight) {
                setPercentage(35);
                setOverlayPosition("absolute");
                setImageOffset(0);
            } else {
                setOverlayPosition("fixed");
                if (scrollY < viewportHeight + maxScroll) {
                    const effectiveScroll = scrollY - viewportHeight;
                    const newPercentage = 35 + (effectiveScroll / maxScroll) * (100 - 35);
                    setPercentage(newPercentage);
                    setImageOffset(effectiveScroll);
                } else {
                    setPercentage(100);
                    setImageOffset(maxScroll);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Ekran genişliğine göre container yüksekliğini ayarla.
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 400) {
                setContainerHeight("250vh");
            } else {
                setContainerHeight("200vh");
            }
        };

        handleResize(); // Başlangıç değeri ayarla.
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Ease-in-out geçiş efekti için transition özellikleri ekliyoruz.
    const overlayStyle = {
        background: `radial-gradient(circle at center, transparent ${percentage}%, #0C0C0C ${percentage}%)`,
        position: overlayPosition,
        top: 0,
        left: 0,
        width: "100%",
        transition: "background 0.5s ease-in-out"
    };

    const overlayStyle1 = {
        background: `rgba(0, 0, 0, 0.25)`,
        position: overlayPosition,
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
    };

    return (
        <div style={{ height: containerHeight }}>
            <div className="blur-div">
                <section id="mainImagePortfolioDetails">
                    {/* Resmi ve alt fade efektini kapsayan wrapper */}
                    <div
                        className="imageWrapper"
                        style={{
                            transform: `translateY(${imageOffset}px)`,
                        }}
                    >
                        <img
                            src={PORTFOLIO_CARD_IMAGE_URL + project?.cardImage}
                            alt="Image"
                        />
                        {/* Fade efekti resmin alt kısmına sabitlenmiş */}
                        <div className="bottomFade"></div>
                    </div>
                    <div className="imgOverlay" style={overlayStyle1}></div>
                    <div className="overlay" style={overlayStyle}></div>
                </section>
            </div>
        </div>
    );
}

export default MainImagePortfolioDetails;
