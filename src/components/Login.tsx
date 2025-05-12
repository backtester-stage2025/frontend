import {useGoogleAuth} from "../hooks/useGoogleAuth.ts";
import {useAuth} from "../context/AuthContext.tsx";

//TODO: googleAuth
// useGoogleLogin -> call to backend with sub
// -> backend checks for user (creates if needed) and returns user info
// -> set user in frontend authContext

export function Login() {
    const { login } = useGoogleAuth();
    const { isAuthenticated, clearAuthState } = useAuth();

    const handleLogout = () => {
        clearAuthState();
        console.log("User logged out");
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