import axios from "axios";

export const authenticateUser = async (accessToken: string) => {
    try {
        const response = await axios.post("/api/auth/google", {accessToken: accessToken});
        return response.data;
    } catch (error) {
        console.error("Error authenticating user:", error);
        throw error;
    }
};