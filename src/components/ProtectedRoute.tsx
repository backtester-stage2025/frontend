import {Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import {LoginRequired} from "./LoginRequired.tsx";

export function ProtectedRoute() {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated) {
        return <LoginRequired/>;
    }
    return <Outlet/>;
}