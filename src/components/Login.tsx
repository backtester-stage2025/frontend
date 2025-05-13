import {useGoogleAuth} from "../hooks/useGoogleAuth.ts";
import {useAuth} from "../context/AuthContext.tsx";

export function Login() {
    const {login} = useGoogleAuth();
    const {isAuthenticated, clearAuthState} = useAuth();

    const handleLogout = () => {
        clearAuthState();
    };

    return (
        <div>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={() => login()}>Login with Google</button>
            )}
        </div>
    );
}