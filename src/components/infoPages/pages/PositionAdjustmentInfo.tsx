import {Box, CardContent, Container, Divider, Typography} from "@mui/material";

export function PositionAdjustmentInfo() {
    return (
        <Container maxWidth="lg">
            <Box sx={{textAlign: 'center', mt: 4}}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="left">
                        Position Adjustment
                    </Typography>
                    <Divider sx={{borderColor: "primary.main"}}/>
                    <Typography variant="body1" sx={{mt: 2}} align="left">
                        Position adjustment is the strategy you use to determine how many stocks to hold on a certain
                        day.
                        This strategy is based on certain indicators and your preferences like risk tolerance.
                        The goal is to optimize your portfolio by adjusting your holdings in response to changing market
                        conditions or your chosen strategy.
                    </Typography>
                    <Box sx={{mt: 3}}>
                        <Typography variant="h6" gutterBottom align="left">
                            Why Position Adjustment Matters
                        </Typography>
                        <Typography variant="body1" align="left" sx={{mb: 2}}>
                            Adjusting your position allows you to manage risk and take advantage of opportunities as
                            they arise.
                            By regularly reviewing and updating the amount of each stock you hold, you can better align
                            your investments with your goals and risk tolerance.
                        </Typography>
                    </Box>
                </CardContent>
            </Box>
        </Container>
    );
}
