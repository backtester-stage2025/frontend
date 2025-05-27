import { Container, Typography, CardContent, Divider, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export function SkewnessInfo() {
    return (
        <Container maxWidth="lg">
            <CardContent>
                <Typography variant="h4" gutterBottom align="left">
                    Skewness
                </Typography>
                <Divider sx={{ borderColor: "primary.main" }} />
                <Typography variant="body1" sx={{ mt: 2 }} align="left">
                    Skewness is a statistical measure that describes the asymmetry of the distribution of returns. It helps investors understand whether the returns are more likely to be positive or negative. A positive skew indicates a higher probability of positive returns, while a negative skew suggests a higher probability of negative returns.
                </Typography>
                <Box>
                    <img
                        src="/assets/skew.png"
                        alt="Skewness Example"
                        style={{maxWidth: '100%', borderRadius: '8px'}}
                    />
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom align="left">
                        Understanding Skewness
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                        Skewness is calculated using the formula:
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ fontFamily: "monospace", mb: 2 }}>
                        skewness = [n / (n - 1)(n - 2)] * Σ[(xᵢ - mean)³] / std³
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                        Here, <strong>n</strong> is the number of values, <strong>mean</strong> is the average of the daily returns, and <strong>std</strong> is the standard deviation of the daily returns. This calculation is performed on the daily returns from the start date to the current date of the simulation.
                    </Typography>
                    <Typography variant="body1" align="left" sx={{ mb: 2 }}>
                        A skewness value close to zero indicates a symmetric distribution, while positive or negative values indicate asymmetry. Understanding skewness can help investors assess the likelihood of extreme positive or negative returns.
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxWidth: 600, mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Distribution</strong></TableCell>
                                    <TableCell><strong>Example Skewness</strong></TableCell>
                                    <TableCell><strong>Description</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Symmetric</TableCell>
                                    <TableCell>0.0</TableCell>
                                    <TableCell>Returns are evenly distributed around the mean.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Positively Skewed</TableCell>
                                    <TableCell>+1.2</TableCell>
                                    <TableCell>Long right tail; higher chance of large positive returns.</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Negatively Skewed</TableCell>
                                    <TableCell>-1.5</TableCell>
                                    <TableCell>Long left tail; higher chance of large negative returns.</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </CardContent>
        </Container>
    );
}
