import Header from "./components/Header";
import {Outlet, Route, Routes} from "react-router-dom";
import {useAppSelector} from "./store";
import HomePage from "./pages/Countries/Home.tsx";
import AboutPage from "./pages/About";
import LogIn from "./pages/Users/LogIn.tsx";
import UserProfiles from "./admin/pages/UserProfiles.tsx";
import HomeAdmin from "./admin/pages/Dashboard/Home.tsx";
import Calendar from "./admin/pages/Calendar.tsx";
import Blank from "./admin/pages/Blank.tsx";
import FormElements from "./admin/pages/Forms/FormElements.tsx";
import BasicTables from "./admin/pages/Tables/BasicTables.tsx";
import Alerts from "./admin/pages/UiElements/Alerts.tsx";
import Avatars from "./admin/pages/UiElements/Avatars.tsx";
import Badges from "./admin/pages/UiElements/Badges.tsx";
import Buttons from "./admin/pages/UiElements/Buttons.tsx";
import Images from "./admin/pages/UiElements/Images.tsx";
import Videos from "./admin/pages/UiElements/Videos.tsx";
import LineChart from "./admin/pages/Charts/LineChart.tsx";
import BarChart from "./admin/pages/Charts/BarChart.tsx";
import Register from "./pages/Users/Register.tsx";
import NotFound from "./admin/pages/OtherPage/NotFound.tsx";
import AdminRoute from "./pages/Admin/AdminRoute.tsx";
import AppLayout from "./admin/layout/AppLayout.tsx";
import ProfilePage from "./pages/Users/Profile.tsx";
import CreateCountry from "./pages/Countries/CreateCountry.tsx";
import AllCities from "./pages/Cities/AllCities.tsx";
import CreateCity from "./pages/Cities/Create";
import ForgotPassword from "./pages/Users/ForgotPassword.tsx";
import ResetPassword from "./pages/Users/ResetPassword.tsx";
import AdminUserSearchPage from "./pages/Admin/AdminUserSearchPage.tsx";
import Landing from "./pages/Landing.tsx";
import GoogleCallback from "./pages/Users/Google/GoogleCallback.tsx";
import TransportationList from "./pages/Transportations/TransportationList.tsx";



const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            <Header />

            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default function App() {
    const user =
        useAppSelector(redux => redux.auth.user);

    console.log("User roles", user?.roles);
    return (
        // <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<MainLayout/>}>
                    <Route index element={<HomePage/>}/>
                    <Route path="about" element={<AboutPage /> }/>,
                    <Route path="/signin" element={<LogIn />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path={"/profile"} element={<ProfilePage />}/>
                    <Route path={"/cities/:id"} element={<AllCities />}/>
                    <Route path={"/Forgot-Password"} element={<ForgotPassword/>}/>
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/google" element={<Landing/>} />
                    <Route path={"/google-callback"} element={<GoogleCallback/>} />
                    <Route path={"transportations"} element={<TransportationList/>} />
                </Route>
                {/* Dashboard Layout */}
                <Route path="/admin" element={<AdminRoute />}>


                    <Route element={<AppLayout />}>
                        <Route index element={<HomeAdmin />} />

                        <Route path="profile" element={<UserProfiles />} />
                        <Route path="calendar" element={<Calendar />} />
                        <Route path="blank" element={<Blank />} />

                        <Route path="form-elements" element={<FormElements />} />
                        <Route path="basic-tables" element={<BasicTables />} />

                        <Route path="alerts" element={<Alerts />} />
                        <Route path="avatars" element={<Avatars />} />
                        <Route path="badge" element={<Badges />} />
                        <Route path="buttons" element={<Buttons />} />
                        <Route path="images" element={<Images />} />
                        <Route path="videos" element={<Videos />} />

                        <Route path="line-chart" element={<LineChart />} />
                        <Route path="bar-chart" element={<BarChart />} />

                        <Route path="countrycreate" element={<CreateCountry />} />
                        <Route path="city/create" element={<CreateCity />} />

                        <Route path="admincountries" element={<HomePage />} />

                        <Route path={"usersearch"} element={<AdminUserSearchPage/>} />

                        <Route path={"transportations"} element={<TransportationList/>} />

                    </Route>

                </Route>

                {/* Auth Layout */}



                {/* Fallback Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        // </BrowserRouter>

    );
}
