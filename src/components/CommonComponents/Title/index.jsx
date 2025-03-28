import './index.scss';

function Title({title, fontSize, fontFamily, color, selected}) {
    const size = fontSize || '14px';
    const family = fontFamily || "'Poppins', sans-serif";

    const actualColor = (selected ? 'white' : color)

    return (
        <section id="title" style={{'--size': size}}>
            <div className="inner">
                <div
                    style={{
                        fontSize: size,
                        fontFamily: family,
                        color: actualColor
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: size,
                        fontFamily: family,
                        color: actualColor
                    }}
                >
                    {title}
                </div>
            </div>
        </section>
    );
}

export default Title;
