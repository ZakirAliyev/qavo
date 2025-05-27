import './index.scss';
import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Navbar from "../../components/CommonComponents/Navbar/index.jsx";
import {usePostSpinUserMutation} from "../../services/userApi.jsx";
import {PulseLoader} from 'react-spinners';
import Swal from 'sweetalert2';
import image1 from "/src/assets/spinImage.png";
import image2 from "/src/assets/spin2.png";
import image3 from "/src/assets/xanSekil.jpg";
import Footer from "../../components/CommonComponents/Footer/index.jsx";

const sectors = [
    {color: '#938bf1', label: '60%', probability: 0.01},
    {color: '#7bff00', label: '50%', probability: 0.02},
    {color: '#bf00ff', label: '40%', probability: 0.3},
    {color: '#0bf', label: '30%', probability: 0.70},
    {color: '#ff8800', label: '20%', probability: 0.75},
    {color: '#ffcc00', label: '15%', probability: 0.85},
];

const SpinPage = () => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const angleRef = useRef(0);
    const [postSpinUser, {isLoading: isPostLoading}] = usePostSpinUserMutation();
    const navigate = useNavigate();

    const [currentSector, setCurrentSector] = useState(sectors[0]);
    const [spinning, setSpinning] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        number: '',
        email: '',
        lessonName: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [targetSectorIndex, setTargetSectorIndex] = useState(-1);

    const dia = 300;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / sectors.length;

    const spinDuration = 5000; // 5 seconds total spin time
    const singleRotation = TAU; // One full rotation

    const drawWheel = (ctx, angle) => {
        ctx.clearRect(0, 0, dia, dia);
        sectors.forEach((sector, i) => {
            const start = arc * i - PI / 2 + angle;
            ctx.beginPath();
            ctx.fillStyle = sector.color;
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, rad, start, start + arc);
            ctx.lineTo(rad, rad);
            ctx.fill();

            ctx.save();
            ctx.translate(rad, rad);
            ctx.rotate(start + arc / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText(sector.label, rad - 15, 10);
            ctx.restore();
        });
    };

    const getWeightedSectorIndex = () => {
        const totalProbability = sectors.reduce((sum, sector) => sum + sector.probability, 0);
        const random = Math.random() * totalProbability;
        let cumulative = 0;

        for (let i = 0; i < sectors.length; i++) {
            cumulative += sectors[i].probability;
            if (random <= cumulative) {
                return i;
            }
        }
        // Fallback to 40% sector (highest probability)
        return 3; // Index of 40% sector
    };

    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    const animate = (startTime, targetIndex) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);

        // Calculate target angle for the selected sector
        const targetAngle = ((sectors.length - targetIndex) % sectors.length) * arc + PI / 2;
        // One full rotation plus the angle to reach the target
        const totalRotation = singleRotation + (targetAngle - (angleRef.current % TAU));

        const easedProgress = easeOutQuad(progress);
        const currentRotation = totalRotation * easedProgress;

        angleRef.current = (angleRef.current + currentRotation) % TAU;
        drawWheel(ctx, angleRef.current);

        if (progress < 1) {
            requestRef.current = requestAnimationFrame(() => animate(startTime, targetIndex));
        } else {
            // Snap to exact target angle
            angleRef.current = targetAngle;
            drawWheel(ctx, angleRef.current);
            setSpinning(false);
            setCurrentSector(sectors[targetIndex]);
            setIsLoading(true);

            // Send the correct sector label
            postSpinUser({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                number: formData.number,
                percent: sectors[targetIndex].label,
                lessonName: formData.lessonName
            }).unwrap()
                .then((response) => {
                    setIsLoading(false);
                    if (response?.statusCode === 201) {
                        Swal.fire({
                            title: 'Təbriklər!',
                            text: `Təbriklər! Qavo Academy-dən ${sectors[targetIndex].label} endirim şansı qazandınız. Tezliklə sizinlə əlaqə saxlanılacaq!`,
                            icon: 'success',
                            confirmButtonText: 'Davam'
                        }).then(() => navigate('/'));
                    } else {
                        throw new Error(response?.error || 'Something went wrong');
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    Swal.fire({
                        title: 'Xəta baş verdi!',
                        text: error?.data?.error || 'API request failed',
                        icon: 'error',
                        confirmButtonText: 'Davam'
                    }).then(() => navigate('/'));
                });
        }
    };

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) drawWheel(ctx, angleRef.current);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    const validateForm = (data) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?\d{10,}$/;
        return (
            data.name.trim().length > 0 &&
            data.surname.trim().length > 0 &&
            phoneRegex.test(data.number.trim()) &&
            emailRegex.test(data.email.trim()) &&
            data.lessonName.trim().length > 0
        );
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        const updatedFormData = {...formData, [name]: value};
        setFormData(updatedFormData);
        setIsFormValid(validateForm(updatedFormData));
    };

    const handleRadioChange = (lessonName) => {
        const updatedFormData = {...formData, lessonName};
        setFormData(updatedFormData);
        setIsFormValid(validateForm(updatedFormData));
    };

    const handleSpin = () => {
        if (spinning || !isFormValid) return;

        const selectedIndex = getWeightedSectorIndex();
        setTargetSectorIndex(selectedIndex);
        setSpinning(true);

        const startTime = performance.now();
        requestRef.current = requestAnimationFrame(() => animate(startTime, selectedIndex));
    };

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && isFormValid && !spinning) {
            handleSpin();
        }
    };

    return (
        <section id="spinPage">
            <Navbar/>
            <div className="container7">
                <div className="wrapper" style={{marginTop: '80px'}}>
                    <div className="row">
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-12 span" style={{
                                    color: '#656565',
                                    fontWeight: '500',
                                    marginBottom: '10px',
                                }}>
                                    TƏLİM MÜDDƏTİ: 2 ay / DƏRS SAATI: 32 saat /TƏDİRS: OFFLİNE
                                </div>
                            </div>
                            <h2>YENİLƏNƏN DÜNYADA</h2>
                            <h2>SOSYAL MEDYA</h2>
                            <h2 style={{margin: '0 0 20px 0'}}>VƏ MARKETİNG</h2>
                            <div className="row">
                                <div className="col-12 span1" style={{
                                    color: '#583199',
                                    fontWeight: '800',
                                    marginBottom: '10px',
                                    background: 'white',
                                    width: 'max-content',
                                    padding: '5px 10px',
                                    paddingTop: '7px',
                                    borderRadius: '5px',
                                }}>
                                    TƏLİMÇİ: ELVAR AGHAMALİYEV
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12 imageWrapper">
                            <img src={image1} alt="Social Media Marketing"/>
                        </div>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="row">
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-12 span" style={{
                                    color: '#656565',
                                    fontWeight: '500',
                                    marginBottom: '10px',
                                }}>
                                    TƏLİM MÜDDƏTİ: 5 ay / DƏRS SAATI: 80 saat /TƏDİRS: OFFLİNE
                                </div>
                            </div>
                            <h2>QRAFİK DİZAYN İLƏ</h2>
                            <h2>GƏLƏCƏK KARİYERANI</h2>
                            <h2 style={{margin: '0 0 20px 0'}}>ÖZÜN DİZAYN ET</h2>
                            <div className="row">
                                <div className="col-12 span1" style={{
                                    color: '#583199',
                                    fontWeight: '800',
                                    marginBottom: '10px',
                                    background: 'white',
                                    width: 'max-content',
                                    padding: '5px 10px',
                                    paddingTop: '7px',
                                    borderRadius: '5px',
                                }}>
                                    TƏLİMÇİ: XƏYAL ƏZİZOV
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12 imageWrapper">
                            <img src={image2} alt="Graphic Design"/>
                        </div>
                    </div>
                </div>
                <div className="wrapper">
                    <div className="row">
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-12 span" style={{
                                    color: '#656565',
                                    fontWeight: '500',
                                    marginBottom: '10px',
                                }}>
                                    TƏLİM MÜDDƏTİ: 2.5 ay / DƏRS SAATI: 45 saat / TƏDRİS: OFFLİNE
                                </div>
                            </div>
                            <h2>VİDEO MONTAJA BAŞLA</h2>
                            <h2>YARADICI GÜCÜNÜ</h2>
                            <h2 style={{margin: '0 0 20px 0'}}>KADRLA GÖSTƏR</h2>
                            <div className="row">
                                <div className="col-12 span1" style={{
                                    color: '#583199',
                                    fontWeight: '800',
                                    marginBottom: '10px',
                                    background: 'white',
                                    width: 'max-content',
                                    padding: '5px 10px',
                                    paddingTop: '7px',
                                    borderRadius: '5px',
                                }}>
                                    TƏLİMÇİ: XAN CƏLİLOV
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12 imageWrapper">
                            <img src={image3} alt="Graphic Design"/>
                        </div>
                    </div>
                </div>
                <div className="wrapper" style={{filter: isLoading ? 'blur(5px)' : 'none', marginBottom: '80px'}}>
                    <div className="row">
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box1">
                                <h2>ÇARXI ÇEVİR</h2>
                                <h2>ENDİRİMİ</h2>
                                <h2 style={{margin: '0 0 20px 0'}}>QAZAN</h2>
                                <div className="row">
                                    <div className="col-6" style={{padding: '0 5px 0 0'}}>
                                        <input
                                            name="name"
                                            placeholder="Ad"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-6" style={{padding: '0 0 0 5px'}}>
                                        <input
                                            name="surname"
                                            placeholder="Soyad"
                                            value={formData.surname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            name="number"
                                            placeholder="Telefon"
                                            value={formData.number}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <input
                                            name="email"
                                            placeholder="E-mail"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className={formData.lessonName === 'MARKETİNG DƏRSLƏRİ' ? 'inputRadio selected' : 'inputRadio'}
                                        onClick={() => handleRadioChange('MARKETİNG DƏRSLƏRİ')}
                                    >
                                        <input
                                            type="radio"
                                            name="lesson"
                                            value="MARKETİNG DƏRSLƏRİ"
                                            checked={formData.lessonName === 'MARKETİNG DƏRSLƔRİ'}
                                            onChange={() => handleRadioChange('MARKETİNG DƏRSLƔRİ')}
                                        />
                                        <label>MARKETİNG DƏRSLƔRİ</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className={formData.lessonName === 'QRAFİK DİZAYN' ? 'inputRadio selected' : 'inputRadio'}
                                        onClick={() => handleRadioChange('QRAFİK DİZAYN')}
                                    >
                                        <input
                                            type="radio"
                                            name="lesson"
                                            value="QRAFİK DİZAYN"
                                            checked={formData.lessonName === 'QRAFİK DİZAYN'}
                                            on novidades={() => handleRadioChange('QRAFİK DİZAYN')}
                                        />
                                        <label>QRAFİK DİZAYN</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div
                                        className={formData.lessonName === 'VİDEO MONTAJ' ? 'inputRadio selected' : 'inputRadio'}
                                        onClick={() => handleRadioChange('VİDEO MONTAJ')}
                                    >
                                        <input
                                            type="radio"
                                            name="lesson"
                                            value="VİDEO MONTAJ"
                                            checked={formData.lessonName === 'VİDEO MONTAJ'}
                                            on novidades={() => handleRadioChange('VİDEO MONTAJ')}
                                        />
                                        <label>VİDEO MONTAJ</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <button
                                            disabled={!isFormValid || isLoading || spinning}
                                            style={{
                                                opacity: isFormValid && !isLoading && !spinning ? 1 : 0.5,
                                                cursor: isFormValid && !isLoading && !spinning ? 'pointer' : 'not-allowed'
                                            }}
                                            onClick={handleSpin}
                                        >
                                            ÇARXI ÇEVİR
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12" style={{
                                        color: 'white',
                                        fontSize: '12px',
                                    }}>
                                        * Çarxı çevirmək üçün bütün xanaları doldurun və bir dərs seçin.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-6 col-sm-12 col-xs-12 box box2 box3">
                            <div style={{
                                border: '3px solid white',
                                borderRadius: '50%'
                            }}>
                                <div className="wheel-of-fortune" style={{
                                    position: 'relative',
                                    width: dia,
                                    height: dia,
                                }}>
                                    <div
                                        className="wheel-pointer"
                                        style={{
                                            position: 'absolute',
                                            top: '79.5%',
                                            left: '79.5%',
                                            transform: 'translateX(-50%)',
                                            width: '0',
                                            height: '0',
                                            borderLeft: '10px solid transparent',
                                            borderRight: '10px solid transparent',
                                            borderBottom: '20px solid red',
                                            rotate: '-45deg',
                                            zIndex: 10,
                                        }}
                                    />
                                    <canvas
                                        id="wheel"
                                        ref={canvasRef}
                                        width={dia}
                                        height={dia}
                                        style={{
                                            borderRadius: '50%',
                                            cursor: isFormValid && !spinning && !isLoading ? 'pointer' : 'not-allowed',
                                            filter: 'grayscale(.1)',
                                            opacity: isFormValid ? 1 : 0.5
                                        }}
                                        onClick={isFormValid && !spinning && !isLoading ? handleSpin : null}
                                        onKeyDown={isFormValid && !spinning && !isLoading ? handleKeyDown : null}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={spinning ? 'Wheel is spinning' : 'Spin the wheel'}
                                    />
                                    <div
                                        className="spin-button"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '30%',
                                            height: '30%',
                                            borderRadius: '50%',
                                            background: currentSector.color,
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1.5em',
                                            userSelect: 'none',
                                            cursor: isFormValid && !spinning && !isLoading ? 'pointer' : 'not-allowed',
                                            boxShadow: '0 0 0 8px currentColor, 0 0 15px 5px rgba(0, 0, 0, 0.6)',
                                            transition: 'background 0.3s, opacity 0.3s',
                                        }}
                                        onClick={isFormValid && !spinning && !isLoading ? handleSpin : null}
                                        onKeyDown={isFormValid && !spinning && !isLoading ? handleKeyDown : null}
                                        tabIndex={0}
                                        role="button"
                                        aria-label={spinning ? 'Wheel is spinning' : 'Spin the wheel'}
                                    >
                                        {spinning ? '' : 'SPIN'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isLoading && (
                <div className="loading-overlay">
                    <div style={{
                        position: 'relative',
                        zIndex: 90,
                    }}>
                        <PulseLoader color="white" size={20}/>
                    </div>
                </div>
            )}
            <Footer/>
        </section>
    );
};

export default SpinPage;