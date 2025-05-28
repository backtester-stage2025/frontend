import {
    Box,
    CardContent,
    Container,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

export function RiskInfo() {
    return (
        <Container maxWidth="lg">
            <CardContent>
                <Typography variant="h4" gutterBottom align="left">
                    Risk
                </Typography>
                <Divider sx={{borderColor: "primary.main"}}/>
                <Typography variant="body1" sx={{mt: 2}} align="left">
                    Risk is a measure of the uncertainty or variability in the returns of an investment. It helps
                    investors understand the potential downside and volatility of their investments.
                </Typography>
                <Box sx={{mt: 3}}>
                    <Typography variant="h6" gutterBottom align="left">
                        Daily Risk
                    </Typography>
                    <Typography variant="body1" align="left" sx={{mb: 2}}>
                        Daily risk is simply the standard deviation of the previous returns from the start date to the
                        current date of the simulation. It provides a measure of the day-to-day variability in returns.
                    </Typography>
                    <TableContainer component={Paper} sx={{maxWidth: 600, mt: 2}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Daily Return (%)</strong></TableCell>
                                    <TableCell><strong>Daily Risk (Std Dev)</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Day 1</TableCell>
                                    <TableCell>-</TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 2</TableCell>
                                    <TableCell>+2.00%</TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 3</TableCell>
                                    <TableCell>-0.98%</TableCell>
                                    <TableCell>1.49%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 4</TableCell>
                                    <TableCell>+1.98%</TableCell>
                                    <TableCell>1.53%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="body1" align="left" sx={{fontStyle: 'italic', color: 'primary.main', mt: 1}}>
                        Note: As shown, risk can only be calculated starting from the third day. Therefore, strategies
                        that rely on risk metrics begin on the 3rd day.
                    </Typography>
                </Box>
                <Box sx={{mt: 3}}>
                    <Typography variant="h6" gutterBottom align="left">
                        Annual Risk
                    </Typography>
                    <Typography variant="body1" align="left">
                        The annual risk is calculated by multiplying the daily risk by 16. This provides a yearly
                        perspective on the variability of returns.
                    </Typography>
                </Box>
            </CardContent>
        </Container>
    );
}