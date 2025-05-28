import {Card, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {useAuth} from "../../context/AuthContext";
import {CurrencyType, CurrencyTypeDisplay} from "../../model/CurrencyType";
import {useUpdateUserCurrencyType} from "../../hooks/useAppUser";
import {useState} from "react";

export function UserSettings() {
    const {currencyPreference, setCurrencyPreference} = useAuth();
    const [localCurrency, setLocalCurrency] = useState(currencyPreference ?? CurrencyType.EUR);
    const {sendRequest, isRunning} = useUpdateUserCurrencyType();

    const handleChange = (event: SelectChangeEvent) => {
        const newCurrency = event.target.value as CurrencyType;
        setLocalCurrency(newCurrency);
        setCurrencyPreference?.(newCurrency);
        sendRequest(newCurrency);
    };

    return (
        <Card elevation={3}>
            <CardHeader title="Settings"/>
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Preferred Currency
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="currency-type-label">Currency</InputLabel>
                    <Select
                        labelId="currency-type-label"
                        value={localCurrency}
                        label="Currency"
                        onChange={handleChange}
                        disabled={isRunning}
                        autoWidth
                    >
                        {Object.values(CurrencyType).map((ct) => (
                            <MenuItem key={ct} value={ct}>
                                {CurrencyTypeDisplay[ct]} {ct}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </CardContent>
        </Card>
    );
}
