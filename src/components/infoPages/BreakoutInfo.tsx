import { Typography, Box } from "@mui/material";

export function BreakoutInfo() {
    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Breakout
            </Typography>
            <Typography variant="body1">
                A breakout strategy focuses on identifying price levels where a stock breaks above resistance or below support. Traders use this strategy to capitalize on strong price movements following the breakout.
            </Typography>
        </Box>
    );
}