import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../store";
import api from "../../components/axios/authorized.tsx";
import {useEffect, useState} from "react";

export default function AdminRoute() {
    const user = useAppSelector(state => state.auth.user);
    const isAdmin = useAppSelector(state => state.auth.isAdmin);

    const [authorized, setAuthorized] = useState<boolean | null>(null); // null = loading

    useEffect(() => {
        if (!user || !isAdmin) {
            if (authorized !== false) {
                setAuthorized(false);
            }
            return;
        }

        const checkAdmin = async () => {
            try {
                const res = await api.get("/Entity/GetAdminData");
                if (authorized !== (res.status === 200)) {
                    setAuthorized(res.status === 200);
                }
            } catch {
                if (authorized !== false) setAuthorized(false);
            }
        };

        checkAdmin();
    }, [user, isAdmin]);

    if (!user || !isAdmin) {
        return <Navigate to="/user/login" replace />;
    }

    if (authorized === null) {
        return <div>Loading...</div>;
    }

    if (!authorized) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
