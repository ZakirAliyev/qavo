import './index.scss';
import { useEffect, useState, useRef } from 'react';
import image1 from '/src/assets/folder1.jpg';
import image2 from '/src/assets/folder2.jpg';
import image3 from '/src/assets/folder3.jpg';
import image4 from '/src/assets/folder4.jpg';
import { useNavigate } from "react-router";

function FolderPortfolio({ portfolioName }) {
    const navigate = useNavigate();
    const teamKey = portfolioName.split('-')[1];

    const portfolio = [
        {
            id: 1,
            name: "BUYONIDA.COM",
            imageName: image1,
            team: "codes"
        },
        {
            id: 2,
            name: "EXPOHOME.AZ",
            imageName: image2,
            team: "codes"
        },
        {
            id: 3,
            name: "COLORSTORM.COM.AZ",
            imageName: image3,
            team: "codes"
        },
        {
            id: 4,
            name: "PREMIERTOUR.AZ",
            imageName: image4,
            team: "codes"
        },
        {
            id: 5,
            name: "VICTORY",
            imageName: image1,
            team: "agency"
        },
        {
            id: 6,
            name: "BEER BARREL",
            imageName: image2,
            team: "agency"
        },
        {
            id: 7,
            name: "MEDOKS",
            imageName: image3,
            team: "agency"
        },
        {
            id: 8,
            name: "KLINIKEN ALLIENZ",
            imageName: image4,
            team: "agency"
        },
        {
            id: 9,
            name: "UX/UI DESIGN",
            imageName: image1,
            team: "academy"
        },
        {
            id: 10,
            name: "SOCIAL MEDIA MANAGEMENT",
            imageName: image2,
            team: "academy"
        },
        {
            id: 11,
            name: "GRAPHIC DESIGN",
            imageName: image3,
            team: "academy"
        },
        {
            id: 12,
            name: "MARKETING",
            imageName: image4,
            team: "academy"
        }
    ];

    const filteredPortfolio = portfolio.filter(item => item.team === teamKey);
    console.log(filteredPortfolio);

    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('down');
    const lastScrollY = useRef(0);

    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
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
            setCursorPos({ x: e.clientX, y: e.clientY });
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

    return (
        <section id="folderPortfolio">
            {filteredPortfolio && filteredPortfolio.map((item, i) => {
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
                        <img src={item.imageName} alt={`Image ${i + 1}`} />
                        <div className="overlay">
                            <div className="type">2024</div>
                            <div className="word">{item.name}</div>
                            <div className="type">Photo</div>
                        </div>
                        <div className="overlay1">
                            <div className="type">2024</div>
                            <div className="type">Photo</div>
                        </div>
                    </div>
                );
            })}

            <div
                className={`custom-cursor ${cursorHover ? 'hovered' : ''}`}
                style={{ left: cursorPos.x, top: cursorPos.y }}
            >
                {cursorHover && '[ OPEN ]'}
            </div>

            {isAnimating && <div className="transition-overlay"></div>}
        </section>
    );
}

export default FolderPortfolio;
