import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../store";
import APP_ENV from "../env";
import {logout} from "../services/authSlice.ts";

export default function Header() {

    const user =
        useAppSelector(redux => redux.auth.user);
    const isAdmin = useAppSelector(redux => redux.auth.isAdmin);
    // console.log("User auth", user);
    // console.log("is admin", isAdmin);


    const appDispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <header className="p-4 bg-blue-600 text-white">
            <nav className="flex gap-4 justify-between">
                {
                    isAdmin ?
                    <div className="flex items-center center gap-4 text-xl">
                        <Link to="/" className="hover:underline">Home</Link>
                        <Link to="/about" className="hover:underline">About</Link>
                        <Link to="/admin/countrycreate" className="hover:underline">Create Country</Link>
                        <Link to="/admin/city/create" className="hover:underline">Create City</Link>
                    </div>
                        :
                    <div className="flex items-center center gap-4 text-xl">
                        <Link to="/" className="hover:underline">Home</Link>
                        <Link to="/about" className="hover:underline">About</Link>
                    </div>
                }
                <div>
                    {
                        user!=null  ? (<div className={"flex justify-center items-center gap-4"}>
                                {
                                    isAdmin &&
                                    <Link to={"/admin"} className="hover:underline flex items-center h-full text-xl ">
                                        Admin Menu
                                    </Link>
                                }

                                <Link to="/Profile" className="hover:underline flex items-center h-full">
                                    <div className="flex items-center justify-end gap-4">

                                        <img src={`${APP_ENV.API_BASE_URL}/images/${user ? user.image : "default.png"}`} alt="logo"
                                             className={"rounded-full w-8 h-8"}/>

                                        <h1 className={"text-xl"}>{`${user?.firstName} ${user.lastName}`}</h1>
                                    </div>
                                </Link>
                                <button onClick={()=> {appDispatch(logout());navigate('/')}} className="hover:underline cursor-pointer px-4 py-2 bg-red-600 rounded rounded-xl hover:bg-red-700">Log out</button>

                            </div>)
                            :
                            <div className={"flex justify-start gap-4"}>
                                <Link to="/signup" className="hover:underline">Register</Link>
                                <Link to="/signin" className="hover:underline">Log in</Link>
                            </div>

                    }
                </div>

            </nav>
        </header>
    );
}
