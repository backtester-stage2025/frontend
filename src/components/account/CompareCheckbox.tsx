import {Checkbox, FormControlLabel, Typography} from "@mui/material";
import {ChangeEvent} from "react";

interface CompareCheckboxProps {
    disabled: boolean;
    checked: boolean;
    onSelect: () => void;
    onUnselect: () => void;
}

export function CompareCheckbox(props: Readonly<CompareCheckboxProps>) {
    return <FormControlLabel
        control={
            <Checkbox
                size="small"
                disabled={props.disabled}
                checked={props.checked}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                        props.onSelect()
                    } else {
                        props.onUnselect()
                    }
                }}
                sx={{
                    p: 0.5,
                    mr: 0.5,
                }}
            />
        }
        label={
            <Typography
                variant="caption"
                sx={{
                    fontWeight: "normal",
                    mr: 1,
                    fontSize: "1.1rem",
                    color: props.disabled ? "text.disabled" : "text.secondary",
                }}
            >
                Compare
            </Typography>
        }
        sx={{
            mb: 1,
            ml: 0.5,
        }}
        labelPlacement={"start"}
    />;
}