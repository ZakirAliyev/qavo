import './index.scss';
import {HiMiniChevronUp} from "react-icons/hi2";
import Title from "../Title/index.jsx";
import {IoShareSocialOutline} from "react-icons/io5";
import {FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp} from "react-icons/fa";

function Footer() {

    function handleBack() {
        window.scrollTo(0, 0);
    }

    return (
        <>
            <section id="footer">
                <div className="back" onClick={handleBack}>
                    <HiMiniChevronUp className="icon"/>
                    <div className="title">
                        <Title title="Back Top"/>
                    </div>
                </div>
                <div className={"copy"}>2025 © QavoCodes. All rights reserved.</div>
                <div className="back follow">
                    <div className="title">
                        <Title title="Follow Us"/>
                    </div>
                    <IoShareSocialOutline className={"icon1"}/>
                    <div className="social-links">
                        <span><FaWhatsapp/></span>
                        <span><FaFacebook/></span>
                        <span><FaInstagram/></span>
                        <span><FaTiktok/></span>
                        <span><FaLinkedin/></span>
                    </div>
                </div>
            </section>
            <section id="footerBottom">
                <div>2025 © QavoCodes. All rights reserved.</div>
            </section>
        </>
    );
}

export default Footer;
