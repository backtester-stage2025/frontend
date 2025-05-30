import {StockMetricsView} from "./StockMetricsView.tsx";
import {Box, Typography} from "@mui/material";
import {SimulationReport} from "../../../../model/simulation/SimulationReport.ts";

interface StockMetricsContentProps {
    simulationReport: SimulationReport | undefined;
}

export function StockMetricsContent({simulationReport}: Readonly<StockMetricsContentProps>) {
    if (simulationReport) {
        return <StockMetricsView simulationReport={simulationReport}/>
    } else {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography color="text.secondary">
                    No stock metrics available. Please run a simulation first.
                </Typography>
            </Box>
        )
    }
}