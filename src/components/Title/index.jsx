import './index.scss';

function Title({ title }) {
    return (
        <section id="title">
            <div className="inner">
                <div>{title}</div>
                <div>{title}</div>
            </div>
        </section>
    );
}

export default Title;
