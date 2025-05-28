import {Box, CardContent, Container, Divider, Typography} from "@mui/material";

export function BreakoutInfo() {
    return (
        <Container maxWidth="lg">
            <Box sx={{backgroundColor: 'inherit'}}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="left">
                        What is a Breakout?
                    </Typography>
                    <Divider sx={{borderColor: 'primary.main'}}/>

                    <Typography variant="subtitle1" sx={{mt: 2}} align="left">
                        A <strong>Breakout</strong> happens when the price of a stock or other asset moves outside a
                        defined support or resistance level with increased volume. In simple terms, it's when the price
                        "breaks out" of a pattern or range it's been stuck in for a while.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{mt: 2}} align="left">
                        Understanding Price Levels
                    </Typography>
                    <Typography variant="body1" align="left">
                        In trading, prices often bounce between certain high and low levels:
                    </Typography>
                    <Box component="ul" sx={{listStyleType: 'none', pl: 0}}>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1" align="left">
                                <strong>Support:</strong> A price level where the stock tends to stop falling and may
                                bounce back up.
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1" align="left">
                                <strong>Resistance:</strong> A price level where the stock tends to stop rising and may
                                fall back down.
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{mt: 1}} align="left">
                        When the price breaks through one of these levels — and stays above or below it — that’s called
                        a <strong>breakout</strong>.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{mt: 2}} align="left">
                        Why Breakouts Matter
                    </Typography>
                    <Typography variant="body1" align="left">
                        Breakouts can signal that a new trend is starting. For example:
                    </Typography>
                    <Box component="ul" sx={{listStyleType: 'none', pl: 0}}>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1" align="left">
                                <strong>Breakout above resistance:</strong> May mean the price is starting a new upward
                                trend. Traders often consider buying here.
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1" align="left">
                                <strong>Breakdown below support:</strong> May mean the price is starting to fall
                                further. Traders often consider selling or shorting here.
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{mt: 2}} align="left">
                        How to Calculate a Breakout
                    </Typography>
                    <Typography variant="body1" align="left">
                        To calculate a breakout, follow these steps:
                    </Typography>
                    <Typography variant="body1" align="left" sx={{fontStyle: 'italic', color: 'primary.main', mt: 1}}>
                        Note: The 30-day period is just an example and can be adjusted based on your analysis.
                    </Typography>
                    <Box component="ul" sx={{listStyleType: 'none', pl: 0}}>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1" align="left">1. Take the <strong>maximum price</strong> of the
                                last 30 days.</Typography>
                        </Box>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1" align="left">2. Take the <strong>minimum price</strong> of the
                                last 30 days.</Typography>
                        </Box>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1" align="left">
                                3. Calculate the{' '}
                                <Typography
                                    component="a"
                                    href="/infopages?section=moving-average-crossover"
                                    sx={{textDecoration: 'underline', color: 'primary.main', cursor: 'pointer'}}
                                >
                                    <strong>moving average</strong>
                                </Typography>{' '}
                                of the last 30 days.
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1" align="left">
                                4. Apply the formula:
                            </Typography>
                            <Box sx={{ml: 4}}>
                                <Typography variant="body1" align="left">
                                    <strong>Forecast = (Today's Price - Moving Average) / (Max Price - Min
                                        Price)</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant="body1" sx={{mt: 1}} align="left">
                        Based on the forecast:
                    </Typography>
                    <Box component="ul" sx={{listStyleType: 'none', pl: 0}}>
                        <Box component="li" sx={{mb: 1}}>
                            <Typography variant="body1" align="left"><strong>If Forecast &gt; 0:</strong> Consider
                                buying (BUY).</Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1" align="left"><strong>If Forecast &lt; 0:</strong> Consider
                                selling (SELL).</Typography>
                        </Box>
                    </Box>

                    <Box sx={{bgcolor: 'background.paper', p: 2, borderRadius: 2, my: 2}}>
                        <Typography variant="subtitle1" align="left"><strong>Example:</strong></Typography>
                        <Typography variant="body2" align="left">
                            Imagine a stock has been trading between $95 and $105 for several weeks. If it suddenly
                            rises above $105 and keeps going with strong volume, that could be a breakout — a signal
                            that the price might keep rising.
                        </Typography>
                    </Box>

                    <Box>
                        <img
                            src="/assets/breakout-example.jpg"
                            alt="Price Breakout Example"
                            style={{maxWidth: '100%', borderRadius: '8px'}}
                        />
                    </Box>

                    <Typography variant="body2" sx={{mt: 2, fontStyle: 'italic'}} align="left">
                        Note: Breakouts are not guarantees. False breakouts can happen, so many traders wait for
                        confirmation or use stop-losses to manage risk.
                    </Typography>
                </CardContent>
            </Box>
        </Container>
    );
}