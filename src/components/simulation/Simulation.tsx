import {ChangeEvent, SyntheticEvent, useState} from "react";
import {useSimulationReport} from "../../hooks/useSimulationReport.ts";
import {StockReportRequest} from "../../model/request/StockReportRequest.ts";
import {Box, Button, Tab, Tabs, Typography} from "@mui/material";
import {Loader} from "../util/Loader.tsx";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {useBuyAndSellRisk} from "../../hooks/useBuyAndSellRisk.ts";
import {SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {SimulationDialog} from "./form/SimulationDialog.tsx";
import {TransactionHistory} from "./results/transactions/TransactionHistory.tsx";
import {StockHoldingChart} from "./results/StockHoldingChart.tsx";
import {StockMetricsContent} from "./results/metrics/StockMetricsContent.tsx";
import {InvestmentPerformanceView} from "./results/InvestmentPerformanceView/InvestmentPerformanceView.tsx";

export function Simulation() {
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [result, setResult] = useState<UserPortfolio[]>([]);
    const [tabValue, setTabValue] = useState(0);
    const [showOnlyTradesDays, setShowOnlyTradesDays] = useState(false);
    const [stockReportRequest, setStockReportRequest] = useState<StockReportRequest | null>(null);
    const {sendRequest, isRunning, isError, error} = useBuyAndSellRisk();
    const {
        isLoading: isLoadingReport,
        simulationReport
    } = useSimulationReport(stockReportRequest || null);

    const sendAndProcessRequest = (request: SimulationRequest) => {
        sendRequest(request, {
            onSuccess: (data) => {
                setResult(data);
                setIsDialogOpen(false);

                if (data?.length) {
                    const firstDate = new Date(data[0].date);
                    const lastDate = new Date(data[data.length - 1].date);
                    const firstPortfolioWithShares = data.find(
                        portfolio => Object.keys(portfolio.sharesBought).length > 0
                    );

                    const stockName = firstPortfolioWithShares
                        ? Object.values(firstPortfolioWithShares.sharesBought)[0].stockName
                        : undefined;

                    if (stockName) {
                        const reportRequest: StockReportRequest = {
                            stockName,
                            startCapital: data[0].totalPortfolioValue,
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
                    {tabValue === 3 &&
                        <StockMetricsContent isLoadingReport={isLoadingReport} simulationReport={simulationReport}/>
                    }
                </>
            )}
        </Box>
    );
}