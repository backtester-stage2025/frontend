import {useMemo, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Tab,
    Tabs,
    Typography,
    useTheme
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {useBuyAndSellRisk} from "../../../hooks/useBuyAndSellRisk.ts";
import {SimulationDialog} from "../form/SimulationDialog.tsx";
import {StockMetricsView} from "./metrics/StockMetricsView.tsx";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {UserPortfolio} from "../../../model/simulation/UserPortfolio.ts";
import {Loader} from "../../util/Loader.tsx";

const mockStockMetrics = {
    averageDailyReturn: 0.0012,
    averageAnnualReturn: 0.15,
    dailyRisk: 0.008,
    annualRisk: 0.13,
    averageDrawdownPercentage: 0.05,
    maxDrawdownPercentage: 0.12,
    skewness: 0.23
};

const formatEuro = (value: number) => {
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(value);
};

interface ProfitChartProps {
    portfolioData: UserPortfolio[];
}

function ProfitChart({portfolioData}: Readonly<ProfitChartProps>) {
    const theme = useTheme();

    const chartData = useMemo(() => {
        if (!portfolioData || portfolioData.length === 0) return [];

        const initialValue = portfolioData[0].totalPortfolioValue;

        return portfolioData.map(item => ({
            date: item.date,
            profit: item.totalPortfolioValue - initialValue
        }));
    }, [portfolioData]);

    return (
        <Box sx={{height: 400, width: '100%', mt: 3}}>
            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <TrendingUpIcon color="primary"/>
                Profit Evolution (€)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={chartData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis
                        tickFormatter={(value: number) => formatEuro(value).split('.')[0]}
                    />
                    <Tooltip
                        formatter={(value: number) => formatEuro(value)}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey="profit"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        activeDot={{r: 8}}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}

interface PortfolioDetailsProps {
    portfolio: UserPortfolio
}

function PortfolioDetails({portfolio}: Readonly<PortfolioDetailsProps>) {
    const theme = useTheme();

    return (
        <AccordionDetails sx={{bgcolor: theme.palette.background.paper}}>
            <Grid container spacing={3} sx={{width: "100%"}}>
                <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Share Holdings
                    </Typography>
                    <Box sx={{pl: 2}}>
                        {Object.entries(portfolio.shareHoldings).map(
                            ([symbol, qty]) => (
                                <Typography key={symbol} variant="body2" sx={{mb: 0.5}}>
                                    {symbol}: {qty}
                                </Typography>
                            )
                        )}
                    </Box>
                </Grid>

                <Grid size={{xs: 12, md: 6}}>
                    <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        {Object.values(portfolio.sharesBought).some(qty => qty < 0) ? "Shares Activity" : "Shares Bought"}
                    </Typography>
                    <Box sx={{pl: 2}}>
                        {Object.entries(portfolio.sharesBought).map(
                            ([symbol, qty]) => (
                                <Typography
                                    key={symbol}
                                    variant="body2"
                                    sx={{
                                        mb: 0.5,
                                        color: qty < 0 ? theme.palette.error.main : theme.palette.success.main
                                    }}
                                >
                                    {symbol}: {qty < 0 ? `${Math.abs(qty)} sold` : `${qty} bought`}
                                </Typography>
                            )
                        )}
                    </Box>
                </Grid>
            </Grid>
        </AccordionDetails>
    );
}

export default function Simulation() {
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [result, setResult] = useState<UserPortfolio[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const [showOnlyTradesDays, setShowOnlyTradesDays] = useState(false);
    const {sendRequest, isRunning, isError, error} = useBuyAndSellRisk();

    const sendAndProcessRequest = (request: SimulationRequest) => {
        sendRequest(request, {
            onSuccess: (data) => {
                setResult(data);
                setIsDialogOpen(false);
            }
        });
    };

    // Filter portfolio data to only show days with trades if filter is enabled
    const filteredResult = useMemo(() => {
        if (!result) return null;
        if (!showOnlyTradesDays) return result;

        return result.filter(portfolio =>
            Object.values(portfolio.sharesBought).some(qty => qty !== 0)
        );
    }, [result, showOnlyTradesDays]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleToggleFilter = (event) => {
        setShowOnlyTradesDays(event.target.checked);
    };

    return (
        <Box sx={{width: "100%", maxWidth: 1200, mx: "auto", p: 3}}>
            <Box sx={{mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography variant="h4" component="h1" fontWeight="500">Portfolio Simulation</Typography>
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    variant="contained"
                    size="large"
                >
                    Configure Simulation
                </Button>
            </Box>

            <SimulationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={sendAndProcessRequest}
                isServerError={isError}
                serverError={error}
            />

            {(result || isRunning) && (
                <>
                    <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="simulation tabs">
                            <Tab label="Portfolio Results"/>
                            <Tab label="Stock Metrics"/>
                        </Tabs>
                    </Box>

                    {/* Portfolio Results Tab */}
                    {tabValue === 0 && (
                        <Box>
                            {isRunning ? (
                                <Loader/>
                            ) : (
                                <>
                                    {result && (
                                        <>
                                            <ProfitChart portfolioData={result}/>

                                            <Box sx={{display: 'flex', alignItems: 'center', mt: 4, mb: 2}}>
                                                <Typography variant="h6">Transaction History</Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={showOnlyTradesDays}
                                                            onChange={handleToggleFilter}
                                                            color="primary"
                                                        />
                                                    }
                                                    label="Show only days with trades"
                                                    sx={{ml: 2}}
                                                />
                                            </Box>

                                            {filteredResult && filteredResult?.length > 0 ? (
                                                filteredResult.map((portfolio) => (
                                                    <Accordion key={portfolio.date} disableGutters sx={{mb: 1}}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                                            <Grid container spacing={2} alignItems="center"
                                                                  sx={{width: "100%"}}>
                                                                <Grid size={{xs: 4}}>
                                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                                        {portfolio.date}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid size={{xs: 4}}>
                                                                    <Typography variant="body2">
                                                                        Cash: {formatEuro(portfolio.cashBalance)}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid size={{xs: 4}}>
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        Total: {formatEuro(portfolio.totalPortfolioValue)}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </AccordionSummary>
                                                        <PortfolioDetails portfolio={portfolio}/>
                                                    </Accordion>
                                                ))
                                            ) : (
                                                <Typography color="text.secondary" sx={{mt: 2}}>
                                                    No transactions to display. Try adjusting your filter settings.
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </Box>
                    )}

                    {/* Stock Metrics Tab */}
                    {tabValue === 1 && <StockMetricsView stockMetrics={mockStockMetrics}/>}
                </>
            )}
        </Box>
    );
}