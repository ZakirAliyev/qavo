import {useEffect, useState} from "react";
import "./index.scss";
import "aos/dist/aos.css";
import AOS from "aos";
import {useGetAllBrandsQuery} from "../../../services/userApi.jsx";
import {BRAND_IMAGES} from "../../../constants.js";

function LogoScroll() {
    const {data: getAllBrands} = useGetAllBrandsQuery();
    const brandsData = getAllBrands?.data;

    const [brands, setBrands] = useState([]);

    useEffect(() => {
        // Initialize brands from API data
        if (brandsData) {
            const initialBrands = brandsData.map(brand => ({
                imageName: brand.brendImage
            }));

            // Repeat brands 100 times
            const repeatedBrands = [];
            for (let i = 0; i < 100; i++) {
                repeatedBrands.push(...initialBrands);
            }
            setBrands(repeatedBrands);
        }

        const timer = setTimeout(() => {
            AOS.init({
                duration: 1000,
                once: true,
            });
        }, 800);

        return () => clearTimeout(timer);
    }, [brandsData]);

    return (
        <section id="logoScroll" data-aos="fade-up">
            <div className="residAtaSozu">Siz doğru yerdəsiniz</div>
            <div className="wrapper left">
                {brands.map((brand, index) => (
                    <div className="box" key={index}>
                        <img src={`${BRAND_IMAGES}${brand.imageName}`} alt="Logo"/>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default LogoScroll;