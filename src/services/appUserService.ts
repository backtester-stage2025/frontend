import axios from "axios";

export async function updateUserCurrencyType(currencyType: string): Promise<void> {
    await axios.patch("/api/user/currency", null, {
        params: {currencyType}
    });
}
