import "./index.scss";
import {FaLocationDot, FaPhone} from "react-icons/fa6";
import {RiTelegram2Fill} from "react-icons/ri";
import AOS from 'aos';
import 'aos/dist/aos.css';

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
                        <div className={"main"}>info@qavo.agency</div>
                        <div className={"secondary"}>Email</div>
                    </div>
                    <div className={"box col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-up"}>
                        <FaLocationDot className={"icon"}/>
                        <div className={"main"}>Aşıq Molla Cümə 60, Bakı</div>
                        <div className={"secondary"}>Address</div>
                    </div>
                    <div className={"box box3 col-4 col-md-6 col-sm-6 col-xs-6"} data-aos={"fade-left"}>
                        <FaPhone className={"icon"}/>
                        <div className={"main"}>+994 (012) 345 67 89</div>
                        <div className={"secondary"}>Phone</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Information;
