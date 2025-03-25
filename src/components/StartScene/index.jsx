import { useState, useEffect } from 'react';
import './index.scss';

function StartScene() {
    const [active, setActive] = useState(false);
    const [expand, setExpand] = useState(false);
    const [hideMessage, setHideMessage] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => {
            setActive(true);
        }, 500);
        const timer2 = setTimeout(() => {
            setExpand(true);
        }, 2000);
        const timer3 = setTimeout(() => {
            setHideMessage(true);
        }, 2500);
        const timer4 = setTimeout(() => {
            setActive(false);
        }, 3000);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    return (
        <section id="startScene" className={active ? 'active' : 'passive'}>
            <div className={`square ${expand ? 'expand' : ''}`}></div>
            {!hideMessage && (
                <span className={expand ? 'fade-out' : ''}>
                    Please wait, content is loading
                </span>
            )}
        </section>
    );
}

export default StartScene;
