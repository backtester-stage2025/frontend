import {Box, Container, Divider, Typography} from "@mui/material";

export function DefaultInfo() {
    return (
        <Container maxWidth="md">
            <Box sx={{textAlign: 'center', mt: 4}}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Info Pages
                </Typography>
                <Divider sx={{ borderColor: 'primary.main' }} />

                <Typography variant="subtitle1" sx={{mt: 2, color: 'text.secondary'}}>
                    Please select a category from the menu to learn more.
                </Typography>
                <Typography variant="body2" sx={{mt: 2}}>
                    These pages provide detailed explanations and examples to help you understand different trading
                    strategies and concepts.
                    Use the navigation menu to explore topics like Moving Average Crossovers or Breakouts.
                </Typography>
            </Box>
        </Container>
    );
}