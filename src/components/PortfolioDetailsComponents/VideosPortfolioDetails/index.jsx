import "./index.scss";
import {useEffect, useState, useRef} from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {PORTFOLIO_IMAGE_URL} from "../../../constants.js";

function VideosPortfolioDetails({project}) {
    const [isAnimating, setIsAnimating] = useState(false);
    const videoRefs = useRef([]);

    AOS.init({
        duration: 1000
    });

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            setIsAnimating(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const videos = project?.images?.filter(video => video.endsWith('.webm')) || [];

    console.log(videos);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.25,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const videoEl = entry.target;
                    if (videoEl.dataset.src) {
                        videoEl.src = videoEl.dataset.src;
                        videoEl.load();
                        observer.unobserve(videoEl);
                    }
                }
            });
        }, observerOptions);

        videoRefs.current.forEach((videoEl) => {
            if (videoEl) {
                observer.observe(videoEl);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [videos]);

    return (
        <section
            id="videosPortfolioDetails"
            className={isAnimating ? "animating" : ""}
        >
            <div className="title" data-aos="fade-right">Videolar</div>
            <div className="description" data-aos="fade-up">HAZIRLADIĞIMIZ VİDEO TİPLİ KONTENTLƏR</div>
            <div className="row">
                {videos.map((video, index) => (
                    <div
                        className="col-3 col-md-3 col-sm-6 col-xs-6"
                        key={index}
                        data-aos={index % 2 === 0 ? "fade-right" : "fade-up"}
                    >
                        <div className="video-wrapper">
                            <video
                                controls
                                muted
                                preload="none"
                                data-src={`${PORTFOLIO_IMAGE_URL}${video}`}
                                ref={(el) => (videoRefs.current[index] = el)}
                            >
                                Tarayıcınız video etiketini desteklemiyor.
                            </video>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default VideosPortfolioDetails;
