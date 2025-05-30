import {useMutation} from "@tanstack/react-query";
import {updateUserCurrencyType} from "../services/appUserService.ts";

export function useUpdateUserCurrencyType() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (currencyType: string) => updateUserCurrencyType(currencyType)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    };
}
