import "./index.scss";
import {FaLocationDot, FaPhone} from "react-icons/fa6";
import {RiTelegram2Fill} from "react-icons/ri";
import AOS from 'aos';
import 'aos/dist/aos.css';
import {Link} from "react-router";

function Information() {
    AOS.init({
        duration: 1000
    });
    return (
        <div className={"container"}>
            <section id="information">
                <div className={"row"}>
                    <div className={"box col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-right"}>
                        <RiTelegram2Fill className={"icon"}/>
                        <Link to={"mailto:info@qavo.agency"}>
                            <div className={"main"}>info@qavo.agency</div>
                        </Link>
                        <div className={"secondary"}>Email</div>
                    </div>
                    <div className={"box col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-up"}>
                        <FaLocationDot className={"icon"}/>
                        <Link
                            to={"https://www.google.com/maps/place/60+A%C5%9F%C4%B1q+Molla+C%C3%BCm%C9%99,+Bak%C4%B1/@40.4109547,49.857891,20z/data=!4m6!3m5!1s0x40307d562703bd61:0x53b9da8d77782646!8m2!3d40.4111477!4d49.8581284!16s%2Fg%2F11x36th7r1?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoJLDEwMjExNjQwSAFQAw%3D%3D"}>
                            <div className={"main"}>Aşıq Molla Cümə 60, Bakı</div>
                        </Link>
                        <div className={"secondary"}>Ünvan</div>
                    </div>
                    <div className={"box box3 col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-left"}>
                        <FaPhone className={"icon"}/>
                        <Link to={"tel:0123456789"}>
                            <div className={"main"}>+994 (012) 345 67 89</div>
                        </Link>
                        <div className={"secondary"}>Əlaqə nömrəsi</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Information;
