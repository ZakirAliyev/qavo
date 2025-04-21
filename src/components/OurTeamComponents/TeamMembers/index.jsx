import './index.scss';
import { useState } from 'react';
import { useGetAllTeamMembersQuery } from "../../../services/userApi.jsx";
import { OUR_TEAM_IMAGES_URL } from "../../../constants.js";

function TeamMembers() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    const { data: getAllTeamMembers } = useGetAllTeamMembersQuery();
    const teamMembers = getAllTeamMembers?.data;

    // Check if the device is desktop (based on window width, e.g., > 768px)
    const isDesktop = window.innerWidth > 768;

    const handleMouseEnter = (index) => {
        if (isDesktop) {
            setHoveredIndex(index);
        }
    };

    const handleMouseLeave = () => {
        if (isDesktop) {
            setHoveredIndex(null);
        }
    };

    const handleMouseMove = (e) => {
        if (isDesktop) {
            setImagePosition({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <section id="teamMembers">
            {teamMembers && teamMembers.map((item, index) => (
                <div
                    key={index}
                    className="team-member"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    <div className="wrapper">
                        <div className="type">{item?.sinceYear}-ci ildən</div>
                        <div className={`name ${isDesktop && hoveredIndex !== null && hoveredIndex !== index ? "gray" : ""}`}>
                            {item?.fullNameEng}
                        </div>
                        <div className="type">{item?.position}</div>
                    </div>
                    {index < teamMembers.length - 1 && <div className="line"></div>}
                </div>
            ))}
            {isDesktop && teamMembers && hoveredIndex !== null && (
                <img
                    className="hover-image"
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