import {SimulationDialog} from "./form/SimulationDialog.tsx";
import {useState} from "react";
import {useBuyAndSellRisk} from "../../hooks/useBuyAndSellRisk.ts";
import {SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {Button} from "@mui/material";
import {SimulationResult} from "../../model/SimulationResult.ts";
import {SimulationResults} from "./results/SimulationResults.tsx";


export function Simulation() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const { sendRequest, isRunning, isError } = useBuyAndSellRisk()

    const sendAndProcessRequest = (request: SimulationRequest) => {
        sendRequest(request, {
            onSuccess: (data) => {
                setResult(data)
                setIsDialogOpen(false);
            }
        });
    }

    return (
        <div>
            <SimulationDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={sendAndProcessRequest}
            />
            <Button
                onClick={()=>setIsDialogOpen(true)}
                variant="contained"
                sx={{
                    m: 3
                }}
            >
                Simulate Stocks
            </Button>
            <SimulationResults
                result={result}
                isRunning={isRunning}
                isError={isError}
            />
        </div>
    )
}