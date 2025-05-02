import {SimulationDialog} from "./form/SimulationDialog.tsx";
import {useState} from "react";
import {useBuyAndSellRisk} from "../../hooks/useBuyAndSellRisk.ts";
import {SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {Box, Button} from "@mui/material";
import {SimulationResults} from "./results/SimulationResults.tsx";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {Loader} from "../util/Loader.tsx";


export function Simulation() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
    const [result, setResult] = useState<UserPortfolio[] | null>(null);
    const {sendRequest, isRunning, isError, error} = useBuyAndSellRisk()

    const sendAndProcessRequest = (request: SimulationRequest) => {
        sendRequest(request, {
            onSuccess: (data: UserPortfolio[]) => {
                setResult(data)
                setIsDialogOpen(false);
            }
        });
    }

    if (isRunning) {
        return <Loader message="Running simulation..."/>;
    }

    return (
        <Box sx={{width: "75%"}}>
            <SimulationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={sendAndProcessRequest}
                isServerError={isError}
                serverError={error}
            />
            <Button
                onClick={() => setIsDialogOpen(true)}
                variant="contained"
                sx={{
                    m: 3
                }}
            >
                Simulate
            </Button>
            <SimulationResults
                result={result}
                isRunning={isRunning}
            />
        </Box>
    )
}