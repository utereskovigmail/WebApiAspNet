import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import CreatePage from "../pages/Create";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            {path: "create", element: <CreatePage />},
            { path: "about", element: <AboutPage /> },
        ],
    },
]);
