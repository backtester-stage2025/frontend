import { Box, Container, Divider, Typography } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export function IndicatorInfo() {
    return (
        <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Indicator Types
                </Typography>
                <Divider sx={{ borderColor: 'primary.main' }} />

                <Typography variant="body1" sx={{ mt: 2 }}>
                    Explore various trading indicators to enhance your strategies. Trading indicators are tools used to analyze price movements, trends, and market conditions, helping traders make informed decisions.
                </Typography>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Why Use Indicators?
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Indicators provide insights into market behavior and help traders:
                </Typography>
                <Box component="ul" sx={{ listStyleType: 'none', pl: 0, mt: 2 }}>
                    <Box component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <ArrowForwardIosIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1">Identify potential entry and exit points.</Typography>
                    </Box>
                    <Box component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                        <ArrowForwardIosIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1">Confirm trends and avoid false signals.</Typography>
                    </Box>
                    <Box component="li" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowForwardIosIcon sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="body1">Manage risk by understanding market conditions.</Typography>
                    </Box>
                </Box>

                <Typography variant="body1" sx={{ mt: 4, color: 'text.secondary' }}>
                    Select an indicator from the menu to learn more about its purpose, calculation, and usage.
                </Typography>
            </Box>
        </Container>
    );
}