import {Box, Typography} from "@mui/material";

export interface MetricProps {
    name: string;
    value: string;
}

export function Metric({name, value}: Readonly<MetricProps>) {
    return (
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="body2">{name}</Typography>
            <Typography variant="body2" fontWeight={500}>
                {value}
            </Typography>
        </Box>
    );
}