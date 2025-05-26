import { Container, Typography, CardContent, Divider, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export function ReturnsInfo() {
    return (
        <Container maxWidth="lg">
            <CardContent>
                <Typography variant="h4" gutterBottom align="left">
                    Returns
                </Typography>
                <Divider sx={{ borderColor: "primary.main" }} />
                <Typography variant="body1" sx={{ mt: 2 }} align="left">
                    Returns are a measure of the profit or loss of an investment over a specific period. They are a key metric for evaluating the performance of financial assets.
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Daily Returns
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                        Daily returns are the percentual difference between every day. They provide insights into the day-to-day performance of an asset.
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxWidth: 600, mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                    <TableCell><strong>Daily Return (%)</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Day 1</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>-</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 2</TableCell>
                                    <TableCell>$102</TableCell>
                                    <TableCell>+2.00%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 3</TableCell>
                                    <TableCell>$101</TableCell>
                                    <TableCell>-0.98%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 4</TableCell>
                                    <TableCell>$103</TableCell>
                                    <TableCell>+1.98%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Average Daily Return
                    </Typography>
                    <Typography variant="body1" align="left">
                        The average daily return is simply the average of all the previous daily returns since the start of our simulation. It helps to understand the overall daily performance trend.
                    </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Annual Average Return
                    </Typography>
                    <Typography variant="body1" align="left">
                        The annual average return is calculated by multiplying the average daily return by 256, which is the estimated number of trading days in a year. This provides a yearly perspective on returns.
                    </Typography>
                </Box>
            </CardContent>
        </Container>
    );
}