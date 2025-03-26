import './index.scss';
import {useEffect, useState, useRef} from 'react';
import image1 from '/src/assets/folder1.jpg';
import image2 from '/src/assets/folder2.jpg';
import image3 from '/src/assets/folder3.jpg';
import image4 from '/src/assets/folder4.jpg';
import image5 from '/src/assets/folder5.jpg';

function Folder() {
    const images = [image1, image2, image3, image4, image5];
    const words = ["WEB DESIGN", "MOBILE APP DEVELOPMENT", "UI/UX DESIGN", "SEO OPTIMIZATION", "DATA ANALYTICS"];

    // Scroll ile ilgili state'ler
    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrollDirection, setScrollDirection] = useState('down');
    const lastScrollY = useRef(0);

    // Özel imleçle ilgili state'ler
    const [cursorPos, setCursorPos] = useState({x: 0, y: 0});
    const [cursorHover, setCursorHover] = useState(false);

    // Sayfa kaydırma hareketini dinle
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

    return (
        <section id="folder">
            {images.map((img, i) => {
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
                        key={i}
                        className="image-wrapper"
                        style={{
                            zIndex: zIndex,
                            transform: `scale(${scale})`,
                            filter: `blur(${blur}px)`,
                            transition: transitionStyle,
                        }}
                        onMouseEnter={() => setCursorHover(true)}
                        onMouseLeave={() => setCursorHover(false)}
                        onClick={() => console.log(`Tıklanan resim: ${words[i]} (Index: ${i})`)}
                    >
                        <img src={img} alt={`Image ${i + 1}`} />
                        <div className="overlay">
                            <div className="type">2024</div>
                            <div className="word">{words[i]}</div>
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
                style={{left: cursorPos.x, top: cursorPos.y}}
            >
                {cursorHover && '[ OPEN ]'}
            </div>
        </section>
    );
}

export default Folder;
