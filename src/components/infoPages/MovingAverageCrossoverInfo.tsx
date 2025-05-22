import { Typography, Box } from "@mui/material";

export function MovingAverageCrossoverInfo() {
    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Moving Average Crossover
            </Typography>
            <Typography variant="body1">
                This strategy involves using two moving averages, one with a shorter period and one with a longer period. A buy signal is generated when the shorter moving average crosses above the longer moving average, and a sell signal is generated when it crosses below.
            </Typography>
        </Box>
    );
}