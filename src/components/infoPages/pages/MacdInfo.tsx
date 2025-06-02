import { Box, CardContent, Container, Divider, Typography } from "@mui/material";

export function MacdInfo() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ backgroundColor: 'inherit' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="left">
                        What is MACD?
                    </Typography>
                    <Divider sx={{ borderColor: 'primary.main' }} />

                    <Typography variant="subtitle1" sx={{ mt: 2 }} align="left">
                        The <strong>MACD (Moving Average Convergence Divergence)</strong> is a popular momentum
                        indicator used in technical analysis. It helps traders understand changes in the strength,
                        direction, and momentum of a stock’s price.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }} align="left">
                        How MACD is Calculated
                    </Typography>
                    <Typography variant="body1" align="left">
                        MACD is based on the difference between two <strong>Exponential Moving Averages (EMAs)</strong>:
                    </Typography>
                    <Box component="ul" sx={{ listStyleType: 'none', pl: 0 }}>
                        <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body1" align="left">
                                The <strong>12-day EMA</strong> (short-term)
                            </Typography>
                        </Box>
                        <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body1" align="left">
                                The <strong>26-day EMA</strong> (long-term)
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1" align="left">
                                The <strong>MACD Line = 12-day EMA - 26-day EMA</strong>
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mt: 2 }} align="left">
                        A <strong>9-day EMA</strong> of the MACD Line is then calculated. This is called the{" "}
                        <strong>Signal Line</strong> and is used to generate buy and sell signals.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }} align="left">
                        How It Works
                    </Typography>
                    <Typography variant="body1" align="left">
                        Traders use the MACD and Signal Line together:
                    </Typography>
                    <Box component="ul" sx={{ listStyleType: 'none', pl: 0 }}>
                        <Box component="li" sx={{ mb: 1 }}>
                            <Typography variant="body1" align="left">
                                <strong>Buy Signal:</strong> When the MACD Line crosses <strong>above</strong> the Signal Line
                            </Typography>
                        </Box>
                        <Box component="li">
                            <Typography variant="body1" align="left">
                                <strong>Sell Signal:</strong> When the MACD Line crosses <strong>below</strong> the Signal Line
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }} align="left">
                        MACD Histogram
                    </Typography>
                    <Typography variant="body1" align="left">
                        The <strong>MACD Histogram</strong> shows the difference between the MACD Line and the Signal Line.
                        It visually helps identify momentum shifts.
                    </Typography>

                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, my: 2 }}>
                        <Typography variant="subtitle1" align="left"><strong>Example:</strong></Typography>
                        <Typography variant="body2" align="left">
                            Suppose a stock has a 12-day EMA of $105 and a 26-day EMA of $100. The MACD Line is $5. If the
                            Signal Line (9-day EMA of MACD) is $3, the histogram value is $2. Since the MACD is above the
                            Signal Line, this may indicate a buying opportunity.
                        </Typography>
                    </Box>

                    <Box>
                        <img
                            src="/assets/macd.jpg"
                            alt="MACD Example"
                            style={{ maxWidth: '100%', borderRadius: '8px' }}
                        />
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }} align="left">
                        Note: While MACD can be powerful, it works best when used with other indicators or confirmation
                        tools to reduce false signals.
                    </Typography>
                </CardContent>
            </Box>
        </Container>
    );
}
