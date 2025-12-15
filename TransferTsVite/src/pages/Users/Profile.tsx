
import type AuthUser from "../../Interfaces/User/AuthUser";
import ENV from "../../env/index";
import {useEffect, useState} from "react";
import api from "../../components/axios/authorized.tsx";
import {useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {logout} from "../../services/authSlice.ts";
import {useAppDispatch} from "../../store";



export default function ProfilePage() {
    const [user, setUser] = useState<AuthUser | null>(null);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await api.get("/entity/me");
                setUser(result.data);
            } catch (err) {
                setUser(null);
                console.log(err);
            }
        };

        loadUser();
    }, []);

    const appDispatch = useAppDispatch();

    const queryClient = useQueryClient();

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
            {
                user!=null ?
                    <div className="bg-white shadow-xl rounded-xl p-8 max-w-lg w-full">

                        {/* Avatar + Name */}
                        <div className="flex flex-col items-center">
                            <img
                                src={`${ENV.API_BASE_URL}/images/${user.image}`}
                                alt="profile"
                                className="w-28 h-28 rounded-full object-cover shadow-md"
                            />
                            <h1 className="text-2xl font-semibold text-gray-800 mt-4">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-gray-500">{user.email}</p>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 my-6"></div>

                        {/* Roles */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Roles</h2>
                            <div className="flex flex-wrap gap-2">
                                {user.roles.map((role) => (
                                    <span
                                        key={role}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                                    >
                {role}
              </span>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 my-6"></div>

                        {/* Actions */}
                        <div className="flex justify-between">
                            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium">
                                Edit Profile
                            </button>

                            <button onClick={()=> {appDispatch(logout());navigate('/')}}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium">
                                Logout
                            </button>
                        </div>

                    </div>
                    :
                    <div>
                        <h1 className={"text-2xl text-red-500 text-center"}>Error occurred</h1>
                    </div>
            }

        </div>
    );
}
