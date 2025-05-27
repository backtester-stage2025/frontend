import {ChangeEvent, useEffect, useState} from "react";
import {useSimulationReport} from "../../hooks/useSimulationReport.ts";
import {StockReportRequest} from "../../model/request/StockReportRequest.ts";
import {Alert, Box, Button, IconButton, Snackbar, Toolbar, Tooltip, Typography} from "@mui/material";
import {Share as ShareIcon} from "@mui/icons-material";
import {Loader} from "../util/Loader.tsx";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {useStartSimulation} from "../../hooks/useStartSimulation.ts";
import {SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {SimulationDialog} from "./form/SimulationDialog.tsx";
import {useSearchParams} from "react-router-dom";
import {useGetSimulationById} from "../../hooks/useSimulationHistory.ts";
import {UUID} from "../../model/UUID.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {ShareSimulationDialog} from "./ShareSimulationDialog.tsx";
import {SimulationTabs} from "./results/SimulationTabs.tsx";

export function Simulation() {
    const [searchParams] = useSearchParams();

    const [simulationId, setSimulationId] = useState<UUID>(searchParams.get("id") as UUID);
    const allowOpenFormParam = searchParams.get("allowOpenForm");
    const allowOpenForm = allowOpenFormParam === null ? true : allowOpenFormParam !== "false";

    const {isAuthenticated} = useAuth()
    const {
        isLoading: isLoadingSimulation,
        simulation,
    } = useGetSimulationById(simulationId);

    const {sendRequest, isRunning, isError, error} = useStartSimulation();

    const [isDialogOpen, setIsDialogOpen] = useState(simulationId == null);
    const [result, setResult] = useState<UserPortfolio[]>(simulation?.userPortfolios ?? []);
    const [showOnlyTradesDays, setShowOnlyTradesDays] = useState(true);
    const [stockReportRequest, setStockReportRequest] = useState<StockReportRequest | null>(simulation?.stockSimulationRequest ?? null);
    const [lastSimulationRequest, setLastSimulationRequest] = useState<SimulationRequest | null>(simulation?.stockSimulationRequest ?? null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    useEffect(() => {
        if (simulation) {
            setResult(simulation.userPortfolios);
            setStockReportRequest(simulation.stockSimulationRequest);
            setLastSimulationRequest(simulation.stockSimulationRequest);
        }
    }, [simulation]);

    const {
        isLoading: isLoadingReport,
        simulationReport
    } = useSimulationReport(stockReportRequest);

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

                setSimulationId(data.simulationId);

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

    const handleToggleFilter = (event: ChangeEvent<HTMLInputElement>) => {
        setShowOnlyTradesDays(event.target.checked);
    };

    if (isRunning) {
        return <Loader message="Running simulation..."/>;
    }

    const handleShareSimulation = () => {
        if (!simulationId) return;
        setShareDialogOpen(true);
    };

    return (
        <Box sx={{width: "100%", maxWidth: 1200, mx: "auto", p: 3}}>
            <Toolbar/>
            {allowOpenForm && isAuthenticated &&
                <>
                    <Box sx={{mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="h4" component="h1" fontWeight="500">Portfolio Simulation</Typography>
                        <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                            {simulationId && (
                                <Tooltip title="Share this simulation">
                                    <IconButton
                                        onClick={handleShareSimulation}
                                        color="primary"
                                        size="large"
                                    >
                                        <ShareIcon/>
                                    </IconButton>
                                </Tooltip>
                            )}
                            <Button
                                onClick={() => setIsDialogOpen(true)}
                                variant="contained"
                                size="large"
                            >
                                Configure Simulation
                            </Button>
                        </Box>
                    </Box>

                    <SimulationDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        onSubmit={sendAndProcessRequest}
                        isServerError={isError}
                        serverError={error}
                        initialValues={lastSimulationRequest}
                    />
                </>
            }

            <ShareSimulationDialog shareDialogOpen={shareDialogOpen} setShareDialogOpen={setShareDialogOpen}
                                   simulationId={simulationId as string}/>

            {(result || isRunning || isLoadingReport || isLoadingSimulation) && (
                <SimulationTabs isRunning={isRunning} result={result}
                                showOnlyTradesDays={showOnlyTradesDays}
                                handleToggleFilter={handleToggleFilter} simulationReport={simulationReport}
                                lastSimulationRequest={lastSimulationRequest}
                                isLoadingReport={isLoadingReport}/>
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