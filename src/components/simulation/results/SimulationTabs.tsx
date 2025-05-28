import {Box, Tab, Tabs, Typography} from "@mui/material";
import {InvestmentPerformanceView} from "./InvestmentPerformanceView/InvestmentPerformanceView.tsx";
import {StockHoldingChart} from "./StockHoldingChart.tsx";
import {TransactionHistory} from "./transactions/TransactionHistory.tsx";
import {SimulationConfigurationView} from "./SimulationConfigurationView.tsx";
import {StockMetricsContent} from "./metrics/StockMetricsContent.tsx";
import {Loader} from "../../util/Loader.tsx";
import {UserPortfolio} from "../../../model/simulation/UserPortfolio.ts";
import {SimulationReport} from "../../../model/simulation/SimulationReport.ts";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {ChangeEvent, SyntheticEvent, useState} from "react";

interface SimulationTabsProps {
    isRunning: boolean;
    result: UserPortfolio[];
    showOnlyTradesDays: boolean;
    handleToggleFilter: (event: ChangeEvent<HTMLInputElement>) => void;
    simulationReport: SimulationReport[] | undefined;
    lastSimulationRequest: SimulationRequest | null;
    isLoadingReport: boolean;
    currencyType?: string;
}

export function SimulationTabs({
                                   isRunning,
                                   result,
                                   showOnlyTradesDays,
                                   handleToggleFilter,
                                   simulationReport,
                                   lastSimulationRequest,
                                   isLoadingReport,
                                   currencyType
                               }: Readonly<SimulationTabsProps>) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (<>
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="simulation tabs">
                    <Tab label="Overview"/>
                    <Tab label="Holdings"/>
                    <Tab label="Transactions"/>
                    <Tab label="Configuration"/>
                    <Tab label="Stock Metrics"/>
                </Tabs>
            </Box>

            {/* Profit chart Tab */}
            {tabValue === 0 && (
                <Box>
                    {isRunning ? (
                        <Loader/>
                    ) : (
                        result && <InvestmentPerformanceView portfolioData={result} currencyPreference={currencyType}/>
                    )}
                </Box>
            )}

            {/* Holdings Tab */}
            {tabValue === 1 && (
                <Box>
                    {isRunning ? (
                        <Loader/>
                    ) : (
                        result && <StockHoldingChart portfolioData={result} currencyPreference={currencyType}/>
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
                                currencyPreference={currencyType}
                            />
                        )
                    )}
                </Box>
            )}

            {/* Configuration Tab */}
            {tabValue === 3 && (
                <Box>
                    {lastSimulationRequest ? (
                        <SimulationConfigurationView simulationRequest={lastSimulationRequest}/>
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No simulation configuration available
                        </Typography>
                    )}
                </Box>
            )}

            {/* Stock Metrics Tab */}
            {tabValue === 4 && simulationReport && (
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
    )
}