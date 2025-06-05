import {UseFormRegisterReturn} from "react-hook-form";
import {TextField} from "@mui/material";
import {renderTooltipAdornment} from "./TooltipAdornment.tsx";

interface RequiredTextInputProps {
    label: string;
    error?: { message?: string };
    tooltip: { title: string; info: string };
    registration: UseFormRegisterReturn;
    disabled?: boolean;
}

export function RequiredTextInput({label, disabled, registration, error, tooltip}: Readonly<RequiredTextInputProps>) {
    return (
        <TextField
            label={label}
            {...registration}
            disabled={disabled}
            error={!!error}
            helperText={error?.message}
            required
            slotProps={{
                input: {
                    endAdornment: renderTooltipAdornment(
                        tooltip.title,
                        tooltip.info
                    )
                }
            }}
        />
    )
}