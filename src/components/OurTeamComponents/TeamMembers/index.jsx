import './index.scss';
import { useState } from 'react';
import { useGetAllTeamMembersQuery } from "../../../services/userApi.jsx";
import { OUR_TEAM_IMAGES_URL } from "../../../constants.js";

function TeamMembers() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    const { data: getAllTeamMembers } = useGetAllTeamMembersQuery();
    const teamMembers = getAllTeamMembers?.data;

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const handleMouseMove = (e) => {
        setImagePosition({ x: e.clientX, y: e.clientY });
    };

    return (
        <section id="teamMembers">
            {teamMembers && teamMembers.map((item, index) => (
                <div
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    <div className="wrapper">
                        <div className="type">{item?.sinceYear}-ci ildən</div>
                        <div className={`name ${hoveredIndex !== null && hoveredIndex !== index ? "gray" : ""}`}>
                            {item?.fullNameEng}
                        </div>
                        <div className="type">{item?.position}</div>
                    </div>
                    {index < teamMembers.length - 1 && <div className="line"></div>}
                </div>
            ))}
            {teamMembers && hoveredIndex !== null && (
                <img
                    src={OUR_TEAM_IMAGES_URL + teamMembers[hoveredIndex].profilImage}
                    alt="Hover preview"
                    style={{
                        position: 'fixed',
                        top: imagePosition.y,
                        left: imagePosition.x,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        opacity: hoveredIndex !== null ? 1 : 0,
                        transition: 'opacity 0.5s ease'
                    }}
                />
            )}
        </section>
    );
}

export default TeamMembers;
