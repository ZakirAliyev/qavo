import {useState, useEffect} from 'react';
import './index.scss';
import {Triangle} from "react-loader-spinner";

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
            <div className={`square ${expand ? 'expand' : ''}`}>
                <div style={{
                    position: 'absolute',
                    zIndex: 100,
                }}>
                    <Triangle
                        visible={true}
                        height="80"
                        width="80"
                        color="#0c0c0c"
                        ariaLabel="triangle-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            </div>
            {!hideMessage && (
                <span className={expand ? 'fade-out' : ''}>
                    Zəhmət olmasa gözləyin, websayt yüklənir
                </span>
            )}
        </section>
    );
}

export default StartScene;
