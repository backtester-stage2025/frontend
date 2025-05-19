import {Loader} from "../../../util/Loader.tsx";
import {StockMetricsView} from "./StockMetricsView.tsx";
import {Box, Typography} from "@mui/material";
import {SimulationReport} from "../../../../model/simulation/SimulationReport.ts";

interface StockMetricsContentProps {
    isLoadingReport: boolean;
    simulationReport: SimulationReport | undefined;
}

export function StockMetricsContent({isLoadingReport, simulationReport}: Readonly<StockMetricsContentProps>) {

    if (isLoadingReport)
        return <Loader/>

    if (simulationReport) {
        return <StockMetricsView stockMetrics={simulationReport.stockMetrics} stockName={simulationReport.stockName}/>
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