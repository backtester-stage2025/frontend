import {useGoogleLogin} from "@react-oauth/google";
import {useAuth} from "../context/AuthContext";
import {addAccessTokenToAuthHeader, authenticateUser, removeAccessTokenFromAuthHeader} from "../services/authService";

export const useGoogleAuth = () => {
    const {setAuthState, clearAuthState} = useAuth();

    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            try {
                const userInfo = await authenticateUser(codeResponse.code);
                addAccessTokenToAuthHeader(userInfo.token);
                setAuthState(true, userInfo.name, userInfo.email, userInfo.id, userInfo.picture,
                    userInfo.currencyType);
            } catch (error) {
                removeAccessTokenFromAuthHeader();
                console.error("Authentication failed:", error);
            }
        },
        scope: "openid email profile",
    });

    const logout = () => {
        removeAccessTokenFromAuthHeader();
        clearAuthState();
    };

    return {login, logout};
};