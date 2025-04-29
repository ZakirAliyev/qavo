import './index.scss';
import { useEffect, useState, useRef } from 'react';
import image1 from '/src/assets/qavoCodes.png';
import image2 from '/src/assets/qavoAgency.png';
import image3 from '/src/assets/qavoAcademy.png';
import { useNavigate } from "react-router";

function Folder() {
    const navigate = useNavigate();
    const images = [image1, image3, image2];
    const words = ["QAVO CODES", "QAVO AGENCY", "QAVO ACADEMY"];

    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('down');
    const lastScrollY = useRef(0);

    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [cursorHover, setCursorHover] = useState(false);

    // State to track which images should be blurred
    const [isBlurred, setIsBlurred] = useState([false, false, false]);

    // Refs to access the DOM elements of each image wrapper
    const imageRefs = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Existing scroll direction and index logic
            if (currentScrollY > lastScrollY.current) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current) {
                setScrollDirection('up');
            }
            lastScrollY.current = currentScrollY;
            const index = currentScrollY / window.innerHeight;
            setScrollIndex(index);

            // Blur effect logic
            const middle = window.innerHeight *0.70;
            const blurred = [
                // Blur first image if second image's top is above middle
                imageRefs.current[1]?.getBoundingClientRect().top < middle,
                // Blur second image if third image's top is above middle
                imageRefs.current[2]?.getBoundingClientRect().top < middle,
                // Third image is never blurred
                false
            ];
            setIsBlurred(blurred);
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

    return (
        <section id="folder">
            {images.map((img, i) => {
                // Set scale to 0.6 if blurred, 0.8 if not blurred
                let scale = isBlurred[i] ? 0.7 : 0.8;
                let zIndex = 8;

                return (
                    <div
                        key={i}
                        ref={(el) => (imageRefs.current[i] = el)}
                        className="image-wrapper"
                        style={{
                            zIndex: zIndex,
                            transform: `scale(${scale})`,
                            filter: isBlurred[i] ? 'blur(10px)' : 'none'
                        }}
                        onMouseEnter={() => setCursorHover(true)}
                        onMouseLeave={() => setCursorHover(false)}
                        onClick={() => {
                            if (i === 0) {
                                navigate(`/portfolio/qavo-codes`);
                            } else if (i === 1) {
                                navigate(`/portfolio/qavo-agency`);
                            } else if (i === 2) {
                                navigate(`/portfolio/qavo-academy`);
                            }
                        }}
                    >
                        <img src={img} alt={`Image ${i + 1}`} />
                        <div className="overlay">
                            <div className="type">2024</div>
                            <div className="word">{words[i]}</div>
                            <div className="type">Bölmə</div>
                        </div>
                        <div className="overlay1">
                            <div className="type">2024</div>
                            <div className="type">Bölmə</div>
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
        </section>
    );
}

export default Folder;