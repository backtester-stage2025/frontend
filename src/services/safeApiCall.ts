// Handles errors, reduced boilerplate
import {AxiosError} from "axios";

export async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
        return await apiCall();
    } catch (error) {
        const axiosError = error as AxiosError<string>;
        const message = axiosError.response?.data ?? "An unknown error occurred.";
        throw new Error(message);
    }
}