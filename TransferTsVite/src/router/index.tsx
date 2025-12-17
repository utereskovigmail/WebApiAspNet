import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/Countries/Home.tsx";
import AboutPage from "../pages/About";
import CreateCountryPage from "../pages/Countries/CreateCountry.tsx";
import CreateCityPage from "../pages/Cities/Create.tsx";
import AllCities from "../pages/Cities/AllCities.tsx";
import Landing from "../pages/Landing";
import Register from "../pages/Users/Register";
import LogIn from "../pages/Users/LogIn";
import Profile from "../pages/Users/Profile";
import Admin from "../pages/Admin/Admin.tsx";
import AdminRoute from "../pages/Admin/AdminRoute.tsx";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            {path: "createCountry", element: <CreateCountryPage />},
            { path: "about", element: <AboutPage /> },
            {path: "createCity", element: <CreateCityPage/>},
            { path: "cities/:countryId", element: <AllCities /> },
            {path: "landing", element: <Landing/>},
            {path: "user/register", element: <Register/>},
            {path: "user/LogIn", element: <LogIn/>},
            {path: "user/Profile", element: <Profile/>},
            {
                element: <AdminRoute />,
                children: [
                    { path: "admin", element: <Admin /> }
                ]
            },
        ],
    },
]);
