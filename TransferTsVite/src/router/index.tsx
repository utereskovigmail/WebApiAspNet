import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/Home";
import AboutPage from "../pages/About";
import CreateCountryPage from "../pages/CreateCountry";
import CreateCityPage from "../pages/CreateCity";
import AllCities from "../pages/AllCities";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            {path: "createCountry", element: <CreateCountryPage />},
            { path: "about", element: <AboutPage /> },
            {path: "createCity", element: <CreateCityPage/>},
            { path: "cities/:countryId", element: <AllCities /> }
        ],
    },
]);
