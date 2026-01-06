// GoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {loginSuccess} from "../../../services/authSlice.ts";

export default function GoogleCallback() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = params.get("token");

        if (token) {
            dispatch(loginSuccess(token));
            navigate("/");
        } else {
            navigate("/login");
        }
    }, []);

    return <p>Signing you in...</p>;
}
