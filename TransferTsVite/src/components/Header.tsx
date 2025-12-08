import { Link } from "react-router-dom";
import api from "../components/axios/authorized"
import ENV from "../env/index";
import {useEffect, useState} from "react";
import type AuthUser from "../Interfaces/User/AuthUser";



export default function Header() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await api.get("/entity/me");
                setUser(result.data);
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
                setUser(null);
                console.log(err);
            }
        };

        loadUser();
    }, []);
    return (
        <header className="p-4 bg-blue-600 text-white">
            <nav className="flex justify-between gap-4">
                <div className={"flex justify-start gap-4"}>
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/createCountry" className="hover:underline">Create country</Link>
                    <Link to="/createCity" className="hover:underline">Create city</Link>
                    <Link to="/about" className="hover:underline">About</Link>
                </div>
                {
                    isAuthenticated  ? (<div>
                        <Link to="/user/Profile" className="hover:underline flex items-center h-full">
                            <div className="flex items-center justify-end gap-4">

                                <img src={`${ENV.API_BASE_URL}/images/${user ? user.image : "default.png"}`} alt="logo"
                                     className={"rounded-full w-8 h-8"}/>

                                <h1 className={"text-xl"}>{`${user ? user.lastName : ""} ${user ? user.firstName : ""}`}</h1>
                            </div>
                        </Link>

                    </div>)
                        :
                        <div className={"flex justify-start gap-4"}>
                            <Link to="/user/register" className="hover:underline">Register</Link>
                            <Link to="/user/login" className="hover:underline">Log in</Link>
                        </div>

                }

            </nav>
        </header>
    );
}
