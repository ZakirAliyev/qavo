import {Outlet} from "react-router-dom";
import ScrollToTop from "../components/CommonComponents/ScrollToTop/index.jsx";

function MainPage() {

    return (
        <>
            <ScrollToTop/>
            <Outlet/>
        </>
    );
}

export default MainPage;