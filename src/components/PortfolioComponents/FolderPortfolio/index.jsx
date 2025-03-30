import './index.scss';
import {useEffect, useState, useRef} from 'react';
import {useNavigate} from "react-router";
import {useGetAllProjectQuery} from "../../../services/userApi.jsx";
import {PORTFOLIO_CARD_IMAGE_URL} from "../../../constants.js";
import {Blocks, Triangle} from "react-loader-spinner";

function FolderPortfolio({portfolioName}) {
    const navigate = useNavigate();
    const teamKey = portfolioName.split('-')[1];

    const {data: getAllProject, isLoading: getAllProjectLoading} = useGetAllProjectQuery();
    const projects = getAllProject?.data || [];
    const filteredPortfolio = projects.filter(item => item.team === teamKey);

    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('down');
    const lastScrollY = useRef(0);

    const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
    const [cursorHover, setCursorHover] = useState(false);

    const [isAnimating, setIsAnimating] = useState(false);

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
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({x: e.clientX, y: e.clientY});
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    const frontIndex = Math.floor(scrollIndex);
    const progress = scrollIndex - frontIndex;

    const transitionStyle =
        scrollDirection === 'down'
            ? 'transform 1s ease, filter .5s ease'
            : 'transform .3s ease, filter .5s ease';

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
            <section id="folderPortfolio" style={{height: `${sectionHeight}vh`}}>
                {filteredPortfolio.map((item, i) => {
                    let scale = 0.8;
                    let blur = 10;
                    let zIndex = 8;

                    if (i === frontIndex) {
                        scale = 0.85;
                        blur = 0;
                        zIndex = progress < 0.5 ? 10 : 9;
                    } else if (i === frontIndex + 1) {
                        scale = 0.85 + 0.15 * progress;
                        blur = 5 - 5 * progress;
                        zIndex = progress < 0.5 ? 9 : 10;
                    }

                    return (
                        <div
                            key={item.id}
                            className="image-wrapper"
                            style={{
                                zIndex: zIndex,
                                transform: `scale(${scale})`,
                                filter: `blur(${blur}px)`,
                                transition: transitionStyle,
                            }}
                            onMouseEnter={() => setCursorHover(true)}
                            onMouseLeave={() => setCursorHover(false)}
                            onClick={() => handleNavigate(`/portfolio/${portfolioName}/${item.id}`)}
                        >
                            <div className={"imgOverlay"}></div>
                            <img src={PORTFOLIO_CARD_IMAGE_URL + item?.cardImage} alt={`Image ${i + 1}`}/>
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
                    style={{left: cursorPos.x, top: cursorPos.y}}
                >
                    {cursorHover && '[ AÇIN ]'}
                </div>

                {isAnimating && <div className="transition-overlay"></div>}
            </section>
        )
    );
}

export default FolderPortfolio;
