import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { authenticateUser } from "../services/authService";

export const useGoogleAuth = () => {
    const { setAuthState } = useAuth();

    const login = useGoogleLogin({
        onSuccess: (credentialResponse) => {
            const handleLogin = async () => {
                const token = credentialResponse.access_token;

                try {
                    const userInfo = await authenticateUser(token);
                    setAuthState(true, userInfo.name, userInfo.email, userInfo.id);
                    console.log("User authenticated:", userInfo);
                } catch (error) {
                    console.error("Authentication failed:", error);
                }
            };

            handleLogin();
        }
    });

    return { login };
};