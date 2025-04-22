import './index.scss'
import { Link } from 'react-router-dom';

function ErrorPage() {
    return (
        <section id="errorPage">
            <div className="error-container">
                <h1 className="error-title">404</h1>
                <h2 className="error-subtitle">SƏHİFƏ TAPILMADI</h2>
                <p className="error-message">
                    Təəssüf ki, axtardığınız səhifə mövcud deyil. Səhv bir ünvan daxil etmisiniz və ya səhifə silinib.
                </p>
                <Link to="/" className="error-button">
                    ANA SƏHİFƏYƏ QAYIT
                </Link>
            </div>
        </section>
    );
}

export default ErrorPage;