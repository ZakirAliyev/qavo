import './index.scss'

function GoogleMap() {
    return (
        <section id={"googleMap"}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.896315373779!2d49.85555347679543!3d40.411147671440425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d003436b447%3A0xb8c6c13c52985f63!2sQAVO%20MMC!5e0!3m2!1str!2saz!4v1745325537324!5m2!1str!2saz"
                style={{border:'0'}} allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
        </section>
    );
}

export default GoogleMap;