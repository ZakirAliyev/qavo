import "./index.scss";
import { useState, useEffect, useRef } from "react";
import { PORTFOLIO_CARD_IMAGE_URL } from "../../../constants.js";

function MainImagePortfolioDetails({ project }) {
    const [containerHeight, setContainerHeight] = useState("100vh");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const imageWrapperRef = useRef(null);
    const overlayRef = useRef(null);
    const overlay1Ref = useRef(null);

    const maxScroll = 1000;

    useEffect(() => {
        let animationFrameId;

        const handleScroll = () => {
            if (!animationFrameId) {
                animationFrameId = window.requestAnimationFrame(() => {
                    const viewportHeight = window.innerHeight;
                    const scrollY = window.scrollY;

                    let percentage = 0;
                    let overlayPosition = "absolute";

                    if (scrollY > viewportHeight) {
                        overlayPosition = "fixed";
                        const effectiveScroll = Math.min(scrollY - viewportHeight, maxScroll);
                        percentage = (effectiveScroll / maxScroll) * 200;
                    }

                    if (overlayRef.current) {
                        overlayRef.current.style.background = `radial-gradient(circle at center, transparent ${percentage}%, #0C0C0C ${percentage}%)`;
                        overlayRef.current.style.position = overlayPosition;
                    }
                    if (overlay1Ref.current) {
                        overlay1Ref.current.style.position = overlayPosition;
                    }

                    animationFrameId = null;
                });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (animationFrameId) {
                window.cancelAnimationFrame(animationFrameId);
            }
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setContainerHeight(width < 400 ? "150vh" : "100vh");
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const imageUrl = windowWidth < 992
        ? PORTFOLIO_CARD_IMAGE_URL + project?.mobileCardImage
        : PORTFOLIO_CARD_IMAGE_URL + project?.cardImage;

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
                            src={imageUrl}
                            alt="Project"
                            loading="lazy"
                        />
                        <div className="bottomFade"></div>
                    </div>

                    <div
                        className="imgOverlay"
                        ref={overlay1Ref}
                        style={{
                            background: "rgba(0, 0, 0, 0.25)",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            pointerEvents: "none",
                            willChange: "position",
                        }}
                    />

                    <div
                        className="overlay"
                        ref={overlayRef}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100vh",
                            willChange: "background, position",
                        }}
                    />
                </section>
            </div>
        </div>
    );
}

export default MainImagePortfolioDetails;
