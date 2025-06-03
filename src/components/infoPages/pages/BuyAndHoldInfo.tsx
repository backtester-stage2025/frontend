import {Box, CardContent, Container, Divider, Typography} from "@mui/material";

export function BuyAndHoldInfo() {
    return (
        <Container maxWidth="lg">
            <Box sx={{backgroundColor: 'inherit'}}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="left">
                        Buy and Hold
                    </Typography>
                    <Divider sx={{borderColor: 'primary.main'}}/>

                    <Typography variant="body1" sx={{mt: 2}} align="left">
                        The <strong>Buy and Hold</strong> strategy is one of the simplest investment approaches. You
                        invest your available capital by buying a stock (or a set of stocks) on the first day and then
                        simply hold onto your position for the entire investment period, regardless of market
                        fluctuations.
                    </Typography>

                    <Typography variant="h6" sx={{mt: 2}} align="left">
                        How It Works
                    </Typography>
                    <Typography variant="body1" align="left">
                        On day 1, you use as much of your capital as possible to purchase shares. After that, you do not
                        buy or sell any more shares. You keep your position unchanged until the end of the period,
                        ignoring short-term price movements.
                    </Typography>

                    <Box sx={{bgcolor: 'background.paper', p: 2, borderRadius: 2, my: 2}}>
                        <Typography variant="subtitle1" align="left"><strong>Example:</strong></Typography>
                        <Typography variant="body2" align="left">
                            Suppose you have $10,000 and want to invest in AAPL, which is trading at $200 per share. On
                            day 1, you buy 50 shares ($10,000 / $200 = 50). You then hold these shares for the entire
                            investment period, regardless of how the price changes day to day.
                        </Typography>
                    </Box>
                </CardContent>
            </Box>
        </Container>
    );
}
