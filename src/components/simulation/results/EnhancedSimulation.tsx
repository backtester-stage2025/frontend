import {ChangeEvent, SyntheticEvent, useState} from "react";
import {useSimulationReport} from "../../../hooks/useSimulationReport";
import {StockReportRequest} from "../../../model/request/StockReportRequest.ts";
import {Box, Button, Tab, Tabs, Typography} from "@mui/material";
import {Loader} from "../../util/Loader.tsx";
import {UserPortfolio} from "../../../model/simulation/UserPortfolio.ts";
import {useBuyAndSellRisk} from "../../../hooks/useBuyAndSellRisk.ts";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {SimulationDialog} from "../form/SimulationDialog.tsx";
import {StockMetricsView} from "./metrics/StockMetricsView.tsx";
import {ProfitChart} from "./portfolio/ProfitChart.tsx";
import {TransactionHistory} from "./portfolio/TransactionHistory.tsx";

export function EnhancedSimulation() {
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

                if (data && data.length > 0) {
                    const firstDate = new Date(data[0].date);
                    const lastDate = new Date(data[data.length - 1].date);

                    let stockName = "";
                    for (const portfolio of data) {
                        const boughtShares = Object.keys(portfolio.sharesBought);
                        if (boughtShares.length > 0) {
                            stockName = boughtShares[0];
                            break;
                        }
                    }

                    if (stockName) {
                        const reportRequest: StockReportRequest = {
                            stockName: stockName,
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
                            <Tab label="Portfolio Results"/>
                            <Tab label="Stock Metrics" disabled={!simulationReport && !isLoadingReport}/>
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

                                        <TransactionHistory portfolioData={result}
                                                            showOnlyTradesDays={showOnlyTradesDays}
                                                            onToggleFilter={handleToggleFilter}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                )}

                    {/* Stock Metrics Tab */}
                    {tabValue === 1 && (
                        isLoadingReport ? (
                            <Loader/>
                        ) : (
                            simulationReport ? (
                                <StockMetricsView stockMetrics={simulationReport.stockMetrics}/>
                            ) : (
                                <Box sx={{p: 3, textAlign: 'center'}}>
                                    <Typography color="text.secondary">
                                        No stock metrics available. Please run a simulation first.
                                    </Typography>
                                </Box>
                            )
                        )
                    )}
                </>
            )}
        </Box>
    );
}