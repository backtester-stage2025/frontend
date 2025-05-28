import {Box, CardContent, Container, Divider, Typography} from "@mui/material";
import LabelImportantOutlinedIcon from "@mui/icons-material/LabelImportantOutlined";

export function StockMetricsInfo() {
    return (
        <Container maxWidth="lg">
            <Box sx={{textAlign: 'center', mt: 4}}>
                <CardContent>
                    <Typography variant="h4" gutterBottom align="left">
                        Stock Metrics
                    </Typography>
                    <Divider sx={{borderColor: "primary.main"}}/>

                    <Typography variant="subtitle1" sx={{mt: 2}} align="left">
                        <strong>Stock Metrics</strong> are key indicators used to evaluate the performance, value, and
                        potential of a stock. They help investors and traders make informed decisions.
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{mt: 2}} align="left">
                        Why Use Stock Metrics?
                    </Typography>
                    <Typography variant="body1" align="left">
                        Stock metrics provide insights into a company's financial health, market performance, and growth
                        potential. They are essential for:
                    </Typography>
                    <Box component="ul" sx={{listStyleType: "none", pl: 0, mt: 2}}>
                        <Box component="li" sx={{display: "flex", alignItems: "center", mb: 1}}>
                            <LabelImportantOutlinedIcon sx={{color: "primary.main", mr: 1}}/>
                            <Typography variant="body1" align="left">
                                Evaluating a stock's value and growth potential.
                            </Typography>
                        </Box>
                        <Box component="li" sx={{display: "flex", alignItems: "center", mb: 1}}>
                            <LabelImportantOutlinedIcon sx={{color: "primary.main", mr: 1}}/>
                            <Typography variant="body1" align="left">
                                Comparing companies within the same industry.
                            </Typography>
                        </Box>
                        <Box component="li" sx={{display: "flex", alignItems: "center"}}>
                            <LabelImportantOutlinedIcon sx={{color: "primary.main", mr: 1}}/>
                            <Typography variant="body1" align="left">
                                Identifying trends and making data-driven investment decisions.
                            </Typography>
                        </Box>
                    </Box>

                    <Typography variant="body1" sx={{mt: 4, color: "text.secondary"}} align="left">
                        Select an indicator from the menu to learn more about its purpose, calculation, and usage.
                    </Typography>
                </CardContent>
            </Box>
        </Container>
    );
}