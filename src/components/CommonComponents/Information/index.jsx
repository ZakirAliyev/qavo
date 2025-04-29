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
                        <Link to={"mailto:info@qavo.az"}>
                            <div className={"main"}>info@qavo.az</div>
                        </Link>
                        <div className={"secondary"}>Email</div>
                    </div>
                    <div className={"box col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-right"}>
                        <FaPhone className={"icon"}/>
                        <Link to={"tel:+994102655990"}>
                            <div className={"main"} style={{
                                fontSize: '14px'
                            }}>+994 (10) 265 59 90</div>
                        </Link>
                        <Link to={"tel:+994102655992"}>
                            <div className={"main"} style={{
                                fontSize: '14px'
                            }}>+994 (10) 265 59 92</div>
                        </Link>
                        <div className={"secondary"}>Əlaqə nömrəsi</div>
                    </div>
                    <div className={"box box3 col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-up"}>
                        <FaLocationDot className={"icon"}/>
                        <Link
                            to={"https://maps.app.goo.gl/Cp6x9zNTsgv9Zjt5A"}>
                            <div className={"main"}>Aşıq Molla Cümə 60, Bakı</div>
                        </Link>
                        <div className={"secondary"}>Ünvan</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Information;
