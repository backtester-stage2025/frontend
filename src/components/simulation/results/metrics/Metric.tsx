import {Box, Typography} from "@mui/material";

export interface MetricProps {
    name: string;
    value: string;
    isPositive?: boolean;
}

export function Metric({name, value, isPositive}: Readonly<MetricProps>) {
    const valueColor = isPositive === undefined
        ? "text.primary"
        : isPositive
            ? "success.main"
            : "error.main";

    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="body2">{name}</Typography>
            <Typography variant="body2" fontWeight={600} color={valueColor}>
                {value}
            </Typography>
        </Box>
    );
}