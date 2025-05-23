import {Box, CardContent, Container, Divider, Typography} from "@mui/material";

export function MovingAverageCrossoverInfo() {
    return (
        <Container maxWidth="lg">
            <Box sx={{backgroundColor: 'inherit'}}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Moving Average Crossover
                    </Typography>
                    <Divider/>

                    <Typography variant="subtitle1" sx={{mt: 2}}>
                        A <strong>Moving Average Crossover</strong> is a simple method that traders use to figure out
                        when to buy or sell something in the stock market. It’s based on comparing average prices over
                        time to spot when trends might be starting or ending. Traders often combine this technique with
                        other tools to reduce mistakes and improve decisions.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{mt: 2}}>
                        What is a Moving Average?
                    </Typography>
                    <Typography variant="body1">
                        A <strong>Moving Average (MA)</strong> is a way to smooth out price data so it’s easier to see
                        the overall trend. It’s calculated by taking the average price of something — like a stock —
                        over a number of days. For example, a 10-day moving average adds up the last 10 closing prices
                        and divides by 10.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{mt: 2}}>
                        How It Works
                    </Typography>
                    <Typography variant="body1">
                        The crossover strategy compares two moving averages:
                    </Typography>
                    <Typography variant="body1" sx={{mt: 1}}>
                        A <strong>short MA</strong> (like the average over the last 10 days)
                        <br/>
                        A <strong>long MA</strong> (like the average over the last 50 or 200 days)
                    </Typography>
                    <Typography variant="body1" sx={{mt: 1}}>
                        When the short-term average moves above the long-term average, it can be a sign that prices are
                        starting to go up. This is a signal to <strong>buy</strong>. When it drops below the long-term
                        average, it might mean prices are starting to fall — a signal to <strong>sell</strong>.
                    </Typography>

                    <Typography variant="h6" sx={{mt: 2}}>
                        Common Types
                    </Typography>
                    <Box component="ul" sx={{listStyleType: 'none', pl: 0}}>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1">
                                <strong>Golden Cross:</strong> The short-term average rises above the long-term average.
                                This usually means the price is likely to go up.
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1">
                                <strong>Death Cross:</strong> The short-term average falls below the long-term average.
                                This usually means the price may keep falling.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{bgcolor: 'background.paper', p: 2, borderRadius: 2, my: 2}}>
                        <Typography variant="subtitle1"><strong>Example:</strong></Typography>
                        <Typography variant="body2">
                            Imagine a stock’s average price over the last 50 days moves above its 200-day average. This
                            is called a “Golden Cross” and can signal the start of an uptrend — meaning prices might
                            continue to rise, and some traders might choose to buy.
                        </Typography>
                    </Box>

                    <Box>
                        <img
                            src="/src/assets/MAC-example.png"
                            alt="Moving Average Crossover Example"
                            style={{maxWidth: '100%', borderRadius: '8px'}}
                        />
                    </Box>
                </CardContent>
            </Box>
        </Container>
    );
}
