import {ChangeEvent, SyntheticEvent, useState} from "react";
import {useSimulationReport} from "../../hooks/useSimulationReport.ts";
import {StockReportRequest} from "../../model/request/StockReportRequest.ts";
import {Alert, Box, Button, Snackbar, Tab, Tabs, Typography} from "@mui/material";
import {Loader} from "../util/Loader.tsx";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {useStartSimulation} from "../../hooks/useStartSimulation.ts";
import {SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {SimulationDialog} from "./form/SimulationDialog.tsx";
import {TransactionHistory} from "./results/transactions/TransactionHistory.tsx";
import {StockHoldingChart} from "./results/StockHoldingChart.tsx";
import {StockMetricsContent} from "./results/metrics/StockMetricsContent.tsx";
import {InvestmentPerformanceView} from "./results/InvestmentPerformanceView/InvestmentPerformanceView.tsx";
import {useLocation} from "react-router-dom";

export function Simulation() {
    const location = useLocation();
    const {isDialogInitialOpen = true, results = [], request = null} = location.state ?? {};

    const [isDialogOpen, setIsDialogOpen] = useState(isDialogInitialOpen);
    const [result, setResult] = useState<UserPortfolio[]>(results);
    const [tabValue, setTabValue] = useState(0);
    const [showOnlyTradesDays, setShowOnlyTradesDays] = useState(true);
    const [stockReportRequest, setStockReportRequest] = useState<StockReportRequest | null>(request);
    const [lastSimulationRequest, setLastSimulationRequest] = useState<SimulationRequest | null>(request);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const {sendRequest, isRunning, isError, error} = useStartSimulation();
    const {
        isLoading: isLoadingReport,
        simulationReport
    } = useSimulationReport(stockReportRequest || null);

    const sendAndProcessRequest = (request: SimulationRequest) => {
        setLastSimulationRequest(request);
        sendRequest(request, {
            onSuccess: (data) => {
                const portfolios = data.userPortfolios;
                const saveSuccessful = data.saveSuccessful;

                setSnackbarMessage(saveSuccessful
                    ? "Simulation successfully saved!"
                    : "Simulation completed but could not be saved to your history.");
                setSnackbarSeverity(saveSuccessful ? "success" : "error");
                setSnackbarOpen(true);


                setResult(portfolios);
                setIsDialogOpen(false);

                if (portfolios?.length) {
                    const firstDate = new Date(portfolios[0].date);
                    const lastDate = new Date(portfolios[portfolios.length - 1].date);
                    const firstPortfolioWithShares = portfolios.find(
                        portfolio => Object.keys(portfolio.sharesBought).length > 0
                    );

                    const stockNames = firstPortfolioWithShares
                        ? Object.values(firstPortfolioWithShares.sharesBought).map(share => share.stockName)
                        : undefined;

                    if (stockNames && stockNames.length > 0) {
                        const reportRequest: StockReportRequest = {
                            stockNames,
                            startCapital: portfolios[0].totalPortfolioValue,
                            startDate: firstDate,
                            endDate: lastDate
                        };
                        setStockReportRequest(reportRequest);
                    }
                }
            }
        });
    };

    const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleToggleFilter = (event: ChangeEvent<HTMLInputElement>) => {
        setShowOnlyTradesDays(event.target.checked);
    };

    if (isRunning) {
        return <Loader message="Running simulation..."/>;
    }

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
                initialValues={lastSimulationRequest}
            />

            {(result || isRunning || isLoadingReport) && (
                <>
                    <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="simulation tabs">
                            <Tab label="Overview"/>
                            <Tab label="Holdings"/>
                            <Tab label="Transactions"/>
                            <Tab label="Stock Metrics"/>
                        </Tabs>
                    </Box>

                    {/* Profit chart Tab */}
                    {tabValue === 0 && (
                        <Box>
                            {isRunning ? (
                                <Loader/>
                            ) : (
                                result && <InvestmentPerformanceView portfolioData={result}/>
                            )}
                        </Box>
                    )}

                    {/* Holdings Tab */}
                    {tabValue === 1 && (
                        <Box>
                            {isRunning ? (
                                <Loader/>
                            ) : (
                                result && <StockHoldingChart portfolioData={result}/>
                            )}
                        </Box>
                    )}

                    {/* Transactions Tab */}
                    {tabValue === 2 && (
                        <Box>
                            {isRunning ? (
                                <Loader/>
                            ) : (
                                result && (
                                    <TransactionHistory
                                        portfolioData={result}
                                        showOnlyTradesDays={showOnlyTradesDays}
                                        onToggleFilter={handleToggleFilter}
                                    />
                                )
                            )}
                        </Box>
                    )}

                    {/* Stock Metrics Tab */}
                    {tabValue === 3 && simulationReport && (
                        <Box>
                            {simulationReport.map((report) => (
                                <StockMetricsContent
                                    key={JSON.stringify(report.stockMetrics)}
                                    isLoadingReport={isLoadingReport}
                                    simulationReport={report}
                                />
                            ))}
                        </Box>
                    )}
                </>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{width: '100%', mt: 6}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}