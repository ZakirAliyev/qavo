import './index.scss';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router";
import { useGetAllProjectQuery } from "../../../services/userApi.jsx";
import { PORTFOLIO_CARD_IMAGE_URL } from "../../../constants.js";
import { Triangle } from "react-loader-spinner";

function FolderPortfolio({ portfolioName }) {
    const navigate = useNavigate();
    const teamKey = portfolioName.split('-')[1];

    const { data: getAllProject, isLoading: getAllProjectLoading } = useGetAllProjectQuery();
    const projects = getAllProject?.data || [];
    const filteredPortfolio = projects.filter(item => item.team === teamKey);

    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('down');
    const lastScrollY = useRef(0);

    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [cursorHover, setCursorHover] = useState(false);

    const [isAnimating, setIsAnimating] = useState(false);

    // State to track which images should be blurred
    const [isBlurred, setIsBlurred] = useState([]);

    // Refs to access the DOM elements of each image wrapper
    const imageRefs = useRef([]);

    // Pencere genişliğini takip etmek için state
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Initialize isBlurred array based on filteredPortfolio length
        setIsBlurred(new Array(filteredPortfolio.length).fill(false));
        imageRefs.current = new Array(filteredPortfolio.length).fill(null);
    }, [filteredPortfolio.length]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;
            const index = currentScrollY / window.innerHeight;
            setScrollIndex(index);

            // Blur effect logic
            const middle = window.innerHeight / 2;
            const blurred = filteredPortfolio.map((_, i) => {
                if (i === filteredPortfolio.length - 1) {
                    // Last image is never blurred
                    return false;
                }
                // Blur image if the next image's top is above the middle
                return imageRefs.current[i + 1]?.getBoundingClientRect().top < middle;
            });
            setIsBlurred(blurred);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [filteredPortfolio]);

    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    const frontIndex = Math.floor(scrollIndex);
    const progress = scrollIndex - frontIndex;

    const handleNavigate = (path) => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate(path);
        }, 1000);
    };

    const sectionHeight = 100 * filteredPortfolio?.length || 0;

    return (
        getAllProjectLoading ? (
            <div className={"react-spinner"}>
                <Triangle
                    visible={true}
                    height="80"
                    width="80"
                    color="white"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        ) : (
            <section id="folderPortfolio" style={{ height: `${sectionHeight}vh` }}>
                {filteredPortfolio.map((item, i) => {
                    let scale = 0.8;
                    let blur = 0;
                    let zIndex = 8;

                    if (isBlurred[i]) {
                        // Apply blur and reduce scale to 0.6
                        scale = 0.7;
                        blur = 10;
                        zIndex = 8;
                    }
                    // Use mobileCardImage for < 992px, cardImage otherwise
                    const imageSrc = windowWidth < 992
                        ? PORTFOLIO_CARD_IMAGE_URL + item.mobileCardImage
                        : PORTFOLIO_CARD_IMAGE_URL + item.cardImage;

                    return (
                        <div
                            key={item.id}
                            ref={(el) => (imageRefs.current[i] = el)}
                            className="image-wrapper"
                            style={{
                                zIndex: zIndex,
                                transform: `scale(${scale})`,
                                filter: `blur(${blur}px)`,
                            }}
                            onMouseEnter={() => setCursorHover(true)}
                            onMouseLeave={() => setCursorHover(false)}
                            onClick={() => handleNavigate(`/portfolio/${portfolioName}/${item.id}`)}
                        >
                            <div className={"imgOverlay"}></div>
                            <img src={imageSrc} alt={`Image ${i + 1}`} />
                            <div className="overlay">
                                <div className={"typeWrapper"}>
                                    <div className="type">{item?.productionDate}</div>
                                </div>
                                <div className="word">{item?.title}</div>
                                <div className="type">{item?.roleEng}</div>
                            </div>
                            <div className="overlay1">
                                <div className="type">{item?.productionDate}</div>
                                <div className="type">{item?.roleEng}</div>
                            </div>
                        </div>
                    );
                })}

                <div
                    className={`custom-cursor ${cursorHover ? 'hovered' : ''}`}
                    style={{ left: cursorPos.x, top: cursorPos.y }}
                >
                    {cursorHover && '[ AÇIN ]'}
                </div>

                {isAnimating && <div className="transition-overlay"></div>}
            </section>
        )
    );
}

export default FolderPortfolio;