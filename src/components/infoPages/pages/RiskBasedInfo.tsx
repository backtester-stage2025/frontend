import {
    Box,
    CardContent,
    Container,
    Divider,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";

export function RiskBasedInfo() {
    return (
        <Container maxWidth="lg">
            <CardContent>
                <Typography variant="h4" gutterBottom align="left">
                    Risk Based
                </Typography>
                <Divider sx={{borderColor: "primary.main"}}/>
                <Typography variant="body1" sx={{mt: 2}} align="left">
                    A risk-based position adjustment means you calculate the amount of stocks to hold using your preferred risk tolerance.
                    This approach ensures that your investment exposure matches the level of risk you are comfortable taking.
                </Typography>
                <Box sx={{mt: 3}}>
                    <Typography variant="body1" align="left" sx={{mb: 2}}>
                        By considering your risk tolerance, you can determine the optimal position size for each stock.
                        This helps you manage potential losses and maintain a balanced portfolio, especially during volatile market conditions.
                    </Typography>
                </Box>
                <Box sx={{mt: 3}}>
                    <Typography variant="h6" gutterBottom align="left">
                        Dynamic vs. Static Position
                    </Typography>
                    <Typography variant="body1" align="left" sx={{mb: 2}}>
                        <strong>Static position</strong> means you calculate the risk and number of shares to buy on day 1, and then hold that amount throughout the investment period, regardless of how the risk or price changes.
                        <br/><br/>
                        <strong>Dynamic position</strong> means you recalculate the risk and adjust your position every day. This allows your position size to change dynamically in response to changes in the stock's risk or price, helping you stay aligned with your risk tolerance as market conditions evolve.
                    </Typography>
                </Box>
                <Box sx={{mt: 3}}>
                    <Typography variant="h6" gutterBottom align="left">
                        Risk Tolerance
                    </Typography>
                    <Typography variant="body1" align="left" sx={{mb: 2}}>
                        The table below shows how many shares you can hold for different stocks, based on your capital, risk tolerance, share price, and the stock's risk (standard deviation). If the calculated number of shares would require investing more than your capital, you are capped at investing your full capital.
                    </Typography>
                    <TableContainer component={Paper} sx={{maxWidth: 900, mt: 2}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Stock</strong></TableCell>
                                    <TableCell><strong>Capital</strong></TableCell>
                                    <TableCell><strong>Risk Tolerance</strong></TableCell>
                                    <TableCell><strong>Share Price</strong></TableCell>
                                    <TableCell><strong>Stock Risk</strong></TableCell>
                                    <TableCell><strong>Shares to Hold</strong></TableCell>
                                    <TableCell><strong>Capital Invested</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>AAPL</TableCell>
                                    <TableCell>$10,000</TableCell>
                                    <TableCell>20%</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>40%</TableCell>
                                    <TableCell>50</TableCell>
                                    <TableCell>$5,000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>MSFT</TableCell>
                                    <TableCell>$10,000</TableCell>
                                    <TableCell>20%</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>10%</TableCell>
                                    <TableCell>100</TableCell>
                                    <TableCell>$10,000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>GOOGL</TableCell>
                                    <TableCell>$10,000</TableCell>
                                    <TableCell>25%</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>34%</TableCell>
                                    <TableCell>73</TableCell>
                                    <TableCell>$7,300</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{bgcolor: 'background.paper', p: 2, borderRadius: 2, my: 4}}>
                    <Typography variant="subtitle1" align="left"><strong>Examples:</strong></Typography>
                    <Typography variant="body2" align="left">
                        <strong>AAPL:</strong> You have $10,000 capital, a risk tolerance of 20%, share price is $100, and the stock's risk is 40%.<br/>
                        You can hold 50 shares, which means you are investing $5,000 (half your capital) to stay within your risk appetite.<br/><br/>
                        <strong>MSFT:</strong> You have $10,000 capital, a risk tolerance of 20%, share price is $100, and the stock's risk is 10%.<br/>
                        The calculation gives 200 shares, but this would require $20,000, which is more than your available capital. Therefore, you are capped at investing your full capital, so you can buy up to 100 shares ($10,000 / $100 = 100).<br/><br/>
                        <strong>GOOGL:</strong> You have $10,000 capital, a risk tolerance of 25%, share price is $100, and the stock's risk is 34%.<br/>
                        You can hold 73 shares, which means you are investing $7,300 to stay within your risk appetite.
                    </Typography>
                </Box>
            </CardContent>
        </Container>
    );
}
