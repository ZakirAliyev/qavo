import './index.scss';
import { HiMiniChevronUp } from 'react-icons/hi2';
import { FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import Title from '../Title/index.jsx';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Footer() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState('');

    function handleBack() {
        window.scrollTo(0, 0);
    }

    function openModal(platform) {
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        setSelectedPlatform('');
    }

    // Handle click on overlay to close modal
    function handleOverlayClick(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    }

    const platformIcons = {
        WhatsApp: <FaWhatsapp className="modal-title-icon whatsapp" />,
        Facebook: <FaFacebook className="modal-title-icon facebook" />,
        Instagram: <FaInstagram className="modal-title-icon instagram" />,
        TikTok: <FaTiktok className="modal-title-icon tiktok" />,
        LinkedIn: <FaLinkedin className="modal-title-icon linkedin" />,
    };

    const platformLinks = {
        WhatsApp: [
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Codes <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Agency <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
        ],
        Facebook: [
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Codes <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Agency <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
        ],
        Instagram: [
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Codes <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Agency <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
        ],
        TikTok: [
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Codes <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Agency <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
        ],
        LinkedIn: [
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Codes <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
            {
                text: (
                    <>
                        <FaChevronRight className="chevron-icon icon" /> Qavo Agency <FaChevronLeft className="chevron-icon icon" />
                    </>
                ),
                path: '',
            },
        ],
    };

    return (
        <>
            <section id="footer">
                <div className="back" onClick={handleBack}>
                    <HiMiniChevronUp className="icon" />
                    <div className="title">
                        <Title title="Başa Qayıt" />
                    </div>
                </div>
                <div className="copy">2025 © QavoCodes. Bütün hüquqlar qorunur.</div>
                <div className="social-links">
                    <span>
                        <FaWhatsapp className="icon whatsapp" onClick={() => openModal('WhatsApp')} />
                    </span>
                    <span>
                        <FaFacebook className="icon facebook" onClick={() => openModal('Facebook')} />
                    </span>
                    <span>
                        <FaInstagram className="icon instagram" onClick={() => openModal('Instagram')} />
                    </span>
                    <span>
                        <FaTiktok className="icon tiktok" onClick={() => openModal('TikTok')} />
                    </span>
                    <span>
                        <FaLinkedin className="icon linkedin" onClick={() => openModal('LinkedIn')} />
                    </span>
                </div>
            </section>
            <section id="footerBottom">
                <div>2025 © QavoCodes. Bütün hüquqlar qorunur.</div>
            </section>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className={`modal ${selectedPlatform.toLowerCase()}`}>
                        <button className="modal-close" onClick={closeModal}>
                            ×
                        </button>
                        <h4 className="modal-title">
                            {platformIcons[selectedPlatform]} {selectedPlatform}
                        </h4>
                        <ul className="modal-content">
                            {platformLinks[selectedPlatform].map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path} onClick={closeModal}>
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}

export default Footer;