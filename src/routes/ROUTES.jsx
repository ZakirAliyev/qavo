import MainPage from "../pages/index.jsx";
import HomePage from "../pages/HomePage/index.jsx";
import PortfolioPage from "../pages/PortfolioPage/index.jsx";
import PortfolioDetailsPage from "../pages/PortfolioDetailsPage/index.jsx";
import AdminLogin from "../components/AdminComponents/AdminLogin/index.jsx";
import AdminPage from "../pages/AdminPage/index.jsx";
import OurTeamPage from "../pages/OurTeamPage/index.jsx";

export const ROUTES = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: 'portfolio/:name',
                element: <PortfolioPage/>,
            },
            {
                path: 'portfolio/:name/:id',
                element: <PortfolioDetailsPage/>,
            },
            {
                path: 'our-team',
                element: <OurTeamPage/>,
            },
            {
                path: 'cp',
                element: <AdminLogin/>,
            },
            {
                path: 'cp/dashboard',
                element: <AdminPage/>,
            },
            {
                path: 'cp/dashboard/portfolio',
                element: <AdminPage/>,
            },
            {
                path: 'cp/dashboard/agency-portfolio',
                element: <AdminPage/>,
            },
            {
                path: 'cp/dashboard/academy-portfolio',
                element: <AdminPage/>,
            },
        ]
    }
];