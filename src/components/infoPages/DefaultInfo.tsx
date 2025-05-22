import { Typography, Box } from "@mui/material";

export function DefaultInfo() {
    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to the Info Pages
            </Typography>
            <Typography variant="body1">
                Please select a category from the menu to learn more about the indicators.
            </Typography>
        </Box>
    );
}