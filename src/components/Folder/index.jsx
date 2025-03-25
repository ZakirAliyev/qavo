import { useEffect, useState } from 'react';
import image1 from '/src/assets/folder1.jpg';
import image2 from '/src/assets/folder2.jpg';
import image3 from '/src/assets/folder3.jpg';
import image4 from '/src/assets/folder4.jpg';
import image5 from '/src/assets/folder5.jpg';
import './index.scss';

function Folder() {
    const images = [image1, image2, image3, image4, image5];
    const [scrollIndex, setScrollIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const index = window.scrollY / window.innerHeight;
            setScrollIndex(index);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const frontIndex = Math.floor(scrollIndex);
    const progress = scrollIndex - frontIndex;

    return (
        <section id="folder">
            {images.map((img, i) => {
                let scale = 0.85;
                let blur = 10;
                let zIndex = 8;

                if (i === frontIndex) {
                    scale = .9;
                    blur = 0; // progress 0 iken net, 1 iken 5px blur
                    zIndex = progress < 0.5 ? 10 : 9;
                } else if (i === frontIndex + 1) {
                    // Altındaki resim: scroll ilerledikçe büyüyüp netleşiyor.
                    scale = 0.85 + 0.15 * progress;
                    blur = 5 - 5 * progress; // progress 0 iken 5px blur, 1 iken net
                    zIndex = progress < 0.5 ? 9 : 10;
                }

                return (
                    <img
                        key={i}
                        src={img}
                        alt={`Image ${i + 1}`}
                        style={{
                            transform: `scale(${scale})`,
                            filter: `blur(${blur}px)`,
                            zIndex: zIndex,
                            transition: 'transform 1s ease, filter .5s ease',
                        }}
                    />
                );
            })}
        </section>
    );
}

export default Folder;
