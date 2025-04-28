import {SimulationDialog} from "./form/SimulationDialog.tsx";
import {useState} from "react";
import {useBuyAndHold} from "../../hooks/useBuyAndHold.ts";
import {BuyAndHoldSimulationRequest} from "../../model/BuyAndHoldSimulationRequest.ts";
import {Button} from "@mui/material";
import {BuyAndHoldSimulationResult} from "../../model/BuyAndHoldSimulationResult.ts";
import {SimulationResults} from "./results/SimulationResults.tsx";


export function Simulation() {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);
    const [result, setResult] = useState<BuyAndHoldSimulationResult | null>(null);
    const { sendRequest, isRunning, isError } = useBuyAndHold()

    const sendAndProcessRequest = (request: BuyAndHoldSimulationRequest) => {
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