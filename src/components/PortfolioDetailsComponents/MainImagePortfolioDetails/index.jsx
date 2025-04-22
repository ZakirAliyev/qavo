import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { PORTFOLIO_CARD_IMAGE_URL } from "../../../constants.js";

function MainImagePortfolioDetails({ project }) {
    const [containerHeight, setContainerHeight] = useState("200vh");

    // DOM referansları
    const imageWrapperRef = useRef(null);
    const overlayRef = useRef(null);
    const overlay1Ref = useRef(null);

    const maxScroll = 1000;

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const viewportHeight = window.innerHeight;
                    const scrollY = window.scrollY;
                    let percentage, imageOffset, overlayPosition;

                    if (scrollY < viewportHeight) {
                        percentage = 35;
                        imageOffset = 0;
                        overlayPosition = "absolute";
                    } else {
                        overlayPosition = "fixed";
                        if (scrollY < viewportHeight + maxScroll) {
                            const effectiveScroll = scrollY - viewportHeight;
                            percentage = 35 + (effectiveScroll / maxScroll) * (100 - 35);
                            imageOffset = effectiveScroll;
                        } else {
                            percentage = 100;
                            imageOffset = maxScroll;
                        }
                    }

                    // Doğrudan DOM güncellemeleri:
                    if (imageWrapperRef.current) {
                        imageWrapperRef.current.style.transform = `translateY(${imageOffset}px)`;
                    }
                    if (overlayRef.current) {
                        overlayRef.current.style.background = `radial-gradient(circle at center, transparent ${percentage}%, #0C0C0C ${percentage}%)`;
                        overlayRef.current.style.position = overlayPosition;
                    }
                    if (overlay1Ref.current) {
                        overlay1Ref.current.style.position = overlayPosition;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Container yüksekliğini ekran genişliğine göre ayarla.
    useEffect(() => {
        const handleResize = () => {
            setContainerHeight(window.innerWidth < 400 ? "250vh" : "200vh");
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    return (
        <div style={{ height: containerHeight }}>
            <div className="blur-div">
                <section id="mainImagePortfolioDetails">
                    <div
                        className="imageWrapper"
                        ref={imageWrapperRef}
                        style={{ willChange: "transform" }}
                    >
                        <img
                            src={windowWidth < 992 ? (
                                PORTFOLIO_CARD_IMAGE_URL + project?.mobileCardImage
                            ) : (
                                PORTFOLIO_CARD_IMAGE_URL + project?.cardImage
                            )}
                            alt="Image"
                        />
                        <div className="bottomFade"></div>
                    </div>
                    <div
                        className="imgOverlay"
                        ref={overlay1Ref}
                        style={{
                            background: "rgba(0, 0, 0, 0.25)",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            pointerEvents: "none",
                            transition: "background 0.5s ease-in-out",
                            willChange: "background",
                        }}
                    ></div>
                    <div
                        className="overlay"
                        ref={overlayRef}
                        style={{
                            top: 0,
                            left: 0,
                            width: "100%",
                            transition: "background 0.5s ease-in-out",
                            willChange: "background",
                        }}
                    ></div>
                </section>
            </div>
        </div>
    );
}

export default MainImagePortfolioDetails;
