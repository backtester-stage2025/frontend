import { Container, Typography, CardContent, Divider, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export function DrawdownInfo() {
    return (
        <Container maxWidth="lg">
            <CardContent>
                <Typography variant="h4" gutterBottom align="left">
                    Drawdowns
                </Typography>
                <Divider sx={{ borderColor: "primary.main" }} />
                <Typography variant="body1" sx={{ mt: 2 }} align="left">
                    Drawdowns measure the decline from the highest price to a subsequent lower price over a specific period. They are a key metric for understanding the potential losses and risks associated with an investment.
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Understanding Drawdowns
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                        A drawdown is calculated as the percentage difference between the highest price reached and the current price on a given day. It provides insight into the magnitude of losses during a specific period. Drawdowns are particularly useful for evaluating the risk of an investment strategy and its ability to recover from losses.
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxWidth: 600, mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell><strong>Price</strong></TableCell>
                                    <TableCell><strong>Highest Price</strong></TableCell>
                                    <TableCell><strong>Drawdown (%)</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Day 1</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>0%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 2</TableCell>
                                    <TableCell>$95</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>-5.00%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 3</TableCell>
                                    <TableCell>$97</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>-3.00%</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Day 4</TableCell>
                                    <TableCell>$90</TableCell>
                                    <TableCell>$100</TableCell>
                                    <TableCell>-10.00%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Average Drawdown
                    </Typography>
                    <Typography variant="body1" align="left">
                        The average drawdown is the mean of all daily drawdowns over a specific period. It provides a general sense of how much an investment typically declines from its peak. This metric is useful for understanding the overall risk profile of an investment strategy and how often it experiences losses.
                    </Typography>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Maximum Drawdown
                    </Typography>
                    <Typography variant="body1" align="left">
                        The maximum drawdown represents the largest percentage drop from a peak to the lowest price that follows it. It is a critical measure for assessing the worst-case scenario of an investment. A high maximum drawdown indicates significant risk, as it shows the most substantial loss an investor could have experienced during the period.
                    </Typography>
                </Box>
            </CardContent>
        </Container>
    );
}