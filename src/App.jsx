import './App.css'
import {createBrowserRouter} from "react-router";
import {ROUTES} from "./routes/ROUTES.jsx";
import {RouterProvider} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import Cookies from "js-cookie";

function App() {
    const routes = createBrowserRouter(ROUTES);

    const token = Cookies.get("qavoCodesToken");

    if (!token) {
        Cookies.set("qavoCodesToken");
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <HelmetProvider>
                <RouterProvider router={routes}/>
            </HelmetProvider>
        </DndProvider>
    )
}

export default App