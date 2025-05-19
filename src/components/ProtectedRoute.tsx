import { useAuth } from "../context/AuthContext.tsx";
import { LoginRequired } from "./LoginRequired.tsx";
import {ReactNode} from "react";

type ProtectedRouteProps = {
    element: ReactNode;
};

export function ProtectedRoute({ element }: Readonly<ProtectedRouteProps>) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginRequired />;
    }

    return <>{element}</>;
}