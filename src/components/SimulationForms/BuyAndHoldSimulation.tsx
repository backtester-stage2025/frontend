import {BuyAndHoldSimulationDialog} from "./BuyAndHoldSimulationDialog.tsx";
import {useState} from "react";
import {useBuyAndHold} from "../../hooks/useBuyAndHold.ts";
import {BuyAndHoldSimulationRequest} from "../../model/BuyAndHoldSimulationRequest.ts";
import {Box, Button, Card, CardContent, Divider, Typography} from "@mui/material";
import {Loader} from "../Loader.tsx";

export interface StockMetrics {
    averageDailyReturn: number;
    averageAnnualReturn: number;
    dailyRisk: number;
    annualRisk: number;
    averageDrawdownPercentage: number;
    maxDrawdownPercentage: number;
    skewness: number;
}

export interface BuyAndHoldSimulationResult {
    startDate: string;
    endDate: string;
    startCapital: number;
    endCapital: number;
    stockMetrics: StockMetrics;
}

interface ResultScreenProps{
    result: BuyAndHoldSimulationResult | null;
    isRunning: boolean
    isError: boolean
}

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
}

function ResultScreen({ result, isRunning, isError }: ResultScreenProps) {
    if (isError) {
        return <Typography color="error">An error occurred.</Typography>;
    }

    if (isRunning) {
        return <Loader/>;
    }

    if (!result) {
        return null;
    }

    const { startDate, endDate, startCapital, endCapital, stockMetrics } = result;

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Buy &amp; Hold Simulation Result
                </Typography>

                <Typography variant="subtitle1">
                    Period: {startDate} → {endDate}
                </Typography>
                <Typography variant="subtitle1">
                    Start Capital: {formatCurrency(startCapital)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    End Capital: {formatCurrency(endCapital)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Stock Metrics
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Typography>
                            Avg. Daily Return: {formatPercent(stockMetrics.averageDailyReturn)}
                        </Typography>
                        <Typography>
                            Avg. Annual Return: {formatPercent(stockMetrics.averageAnnualReturn)}
                        </Typography>
                        <Typography>
                            Daily Risk: {formatPercent(stockMetrics.dailyRisk)}
                        </Typography>
                        <Typography>
                            Annual Risk: {formatPercent(stockMetrics.annualRisk)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Typography>
                            Avg. Drawdown: {formatPercent(stockMetrics.averageDrawdownPercentage)}
                        </Typography>
                        <Typography>
                            Max Drawdown: {formatPercent(stockMetrics.maxDrawdownPercentage)}
                        </Typography>
                        <Typography>
                            Skewness: {stockMetrics.skewness.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export function BuyAndHoldSimulation() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
    const [result, setResult] = useState<BuyAndHoldSimulationResult | null>(null);
    const { sendRequest, isRunning, isError } = useBuyAndHold()

    const sendAndProcessRequest = (request: BuyAndHoldSimulationRequest) => {
        sendRequest(request, {
            onSuccess: (data) => {
                console.log(data)
                setResult(data)
                setIsDialogOpen(false);
            }
        });
    }

    return (
        <div>
            <BuyAndHoldSimulationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={sendAndProcessRequest}
            />
            <Button onClick={()=>setIsDialogOpen(true)} variant="contained">
                Simulate Stocks
            </Button>
            <ResultScreen
                result={result}
                isRunning={isRunning}
                isError={isError}
            />
        </div>
    )
}