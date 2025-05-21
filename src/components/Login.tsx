import {useGoogleAuth} from "../hooks/useGoogleAuth.ts";
import {useAuth} from "../context/AuthContext.tsx";

export function Login() {
    const {login, logout} = useGoogleAuth();
    const {isAuthenticated} = useAuth();


    return (
        <div>
            {isAuthenticated ? (
                <button onClick={() => logout()}>Logout</button>
            ) : (
                <button onClick={() => login()}>Login with Google</button>
            )}
        </div>
    );
}