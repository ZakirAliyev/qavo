import MainPage from "../pages/index.jsx";
import HomePage from "../pages/HomePage/index.jsx";
import PortfolioPage from "../pages/PortfolioPage/index.jsx";
import PortfolioDetailsPage from "../pages/PortfolioDetailsPage/index.jsx";

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
            }
        ]
    }
];