import './index.scss'
import Accordion from 'rsuite/Accordion';
import 'rsuite/Accordion/styles/index.css';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { FaAngleDoubleDown } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useState } from 'react';

function AccordionMenu() {
    const arr = new Array(10).fill(0);
    const [activeKey, setActiveKey] = useState(null); // Aktiv paneli idarə etmək üçün state

    AOS.init({
        duration: 1000,
    });

    const handleSelect = (eventKey) => {
        // Eyni panelə kliklənərsə bağlanır, fərqli panelə kliklənərsə digərləri bağlanıb yenisi açılır
        setActiveKey(activeKey === eventKey ? null : eventKey);
    };

    return (
        <section id="accordionMenu">
            <div className="container5">
                <div className="row">
                    <div className="box col-6 col-md-6 col-sm-12 col-xs-12">
                        <div>
                            <div className="ourservices" data-aos={"fade-right"}>BİZİM</div>
                            <div className="ourservices" data-aos={"fade-right"}>XİDMƏTLƏRİMİZ</div>
                        </div>
                    </div>
                    <div className="box col-6 col-md-6 col-sm-12 col-xs-12" data-aos={"fade-right"}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                        }}>
                            <Accordion activeKey={activeKey} onSelect={handleSelect}>
                                <Accordion.Panel eventKey="1" header="Veb Dizayn" caretAs={FaAngleDoubleDown}>
                                    Biz müştərilərinizdə uzunmüddətli təəssürat yaradan, istifadəçi dostu və vizual olaraq cəlbedici veb-saytlar dizayn edirik. Saytlarımız həm estetik, həm də funksionaldır, bu da biznesinizin onlayn mühitdə fərqlənməsinə və dönüşüm nisbətinizin artmasına kömək edir.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="2" header="Mobil Tətbiq İnkişafı" caretAs={FaAngleDoubleDown}>
                                    Müasir texnologiyalardan istifadə edərək, iOS və Android platformaları üçün yüksək keyfiyyətli, istifadəsi asan və performanslı mobil tətbiqlər hazırlayırıq. Bu tətbiqlər biznesinizin mobil mühitdə müştərilərlə daha effektiv qarşılıqlı əlaqə qurmasını təmin edir.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="3" header="E-Ticarət Həlləri" caretAs={FaAngleDoubleDown}>
                                    Onlayn satışlarınızı artırmaq üçün təhlükəsiz, sürətli və istifadəçi dostu e-ticarət platformaları təklif edirik. Ödəniş sistemlərinin inteqrasiyasından tutmuş istifadəçi təcrübəsinin optimallaşdırılmasına qədər hər detalda mükəmməlliyə çalışırıq.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="4" header="Rəqəmsal Marketinq" caretAs={FaAngleDoubleDown}>
                                    Brendinizin onlayn görünürlüğünü artırmaq üçün hədəfəuyğun rəqəmsal marketinq strategiyaları hazırlayırıq. Sosial media reklamları, axtarış sistemi reklamları və məzmun marketinqi kimi alətlərlə hədəf auditoriyanıza effektiv şəkildə çatırsınız.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="5" header="UI/UX Dizayn" caretAs={FaAngleDoubleDown}>
                                    İstifadəçi təcrübəsini (UX) və interfeys dizaynını (UI) prioritet hesab edərək, intuitiv, funksional və vizual olaraq cəlbedici dizaynlar yaradırıq. Bu, müştərilərinizin sayt və ya tətbiqinizdən maksimum məmnunluq almasını təmin edir.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="6" header="Brend Strategiyası" caretAs={FaAngleDoubleDown}>
                                    Brendinizin dəyərini və tanınırlığını artırmaq üçün fərdi strategiyalar hazırlayırıq. Loqo dizaynından tutmuş brend hekayəsinin yaradılmasına qədər hər mərhələdə sizinlə birlikdə çalışırıq ki, brendiniz unudulmaz olsun.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="7" header="SEO Optimizasiyası" caretAs={FaAngleDoubleDown}>
                                    Veb-saytınızın axtarış sistemlərində (Google, Bing və s.) yüksək sıralarda yer alması üçün peşəkar SEO xidmətləri təqdim edirik. Açar söz analizi, məzmun optimizasiyası və texniki SEO ilə biznesinizin görünürlüğünü artırırıq.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="8" header="Sosial Media İdarəetmə" caretAs={FaAngleDoubleDown}>
                                    Sosial media platformalarında brendinizin aktiv, cəlbedici və peşəkar şəkildə təmsil olunmasını təmin edirik. Məzmun planlaşdırması, reklam kampaniyaları və auditoriya ilə qarşılıqlı əlaqə ilə brendinizin populyarlığını artırırıq.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="9" header="Məzmun Yaradıcılığı" caretAs={FaAngleDoubleDown}>
                                    Hədəf auditoriyanıza uyğun, dəyərli və cəlbedici məzmunlar yaradırıq. Bloq yazıları, videolar, infoqrafiklər və digər məzmun növləri ilə brendinizin hekayəsini gücləndirir və müştəri loyallığını artırırıq.
                                </Accordion.Panel>
                                <Accordion.Panel eventKey="10" header="Data Analitikası" caretAs={FaAngleDoubleDown}>
                                    Biznesinizin performansını qiymətləndirmək və qərarlarınızı dəstəkləmək üçün dərin data analizi xidmətləri təklif edirik. Müştəri davranışlarından tutmuş marketinq kampaniyalarının effektivliyinə qədər hər şeyi təhlil edərək strategiyalarınızı optimallaşdırırıq.
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