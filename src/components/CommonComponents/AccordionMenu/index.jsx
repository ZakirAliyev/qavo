import './index.scss'
import Accordion from 'rsuite/Accordion';
import 'rsuite/Accordion/styles/index.css';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
import {FaAngleDoubleDown} from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

function AccordionMenu() {
    const arr = new Array(10).fill(0);

    AOS.init({
        duration: 1000,
    })

    return (
        <section id="accordionMenu">
            <div className="container5">
                <div className="row">
                    <div className="box col-6 col-md-6 col-sm-12 col-xs-12">
                        <div>
                            <div className="ourservices" data-aos={"fade-right"}>BIZIM</div>
                            <div className="ourservices" data-aos={"fade-right"}>XIDMETLERIMIZ</div>
                        </div>
                    </div>
                    <div className="box col-6 col-md-6 col-sm-12 col-xs-12" data-aos={"fade-right"}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}>
                            <Accordion>
                                <Accordion.Panel header="Web Design" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="Mobile App Development" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="E-Commerce Solutions" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="Digital Marketing" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="UI/UX Design" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="Brand Strategy" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="SEO Optimization" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="Social Media Management" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="Content Creation" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                                <Accordion.Panel header="Data Analytics" caretAs={FaAngleDoubleDown}>
                                    We create stunning and user-friendly websites that make a lasting impression and drive
                                    conversions.
                                </Accordion.Panel>
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AccordionMenu;
