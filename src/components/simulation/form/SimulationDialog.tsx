import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController} from "./FormController.tsx";
import {simulationTypeOptions, SimulationTypes} from "../../../model/request/SimulationTypes.ts";
import {useEffect, useState} from "react";
import {ErrorOverlay} from "./ErrorOverlay.tsx";
import {simulationRequestSchema} from "./SimulationRequestSchema.ts";
import {CloseButton} from "../../util/CloseButton.tsx";
import {useBrokers} from "../../../hooks/useBrokers.ts";
import {Loader} from "../../util/Loader.tsx";
import {ErrorAlert} from "../../util/Alerts.tsx";

import {Broker} from "../../../model/Broker.ts";
import {FormField} from "./FormField.tsx";
import {TradingIndicatorsSection} from "./TradingIndicatorsSection.tsx";
import {subYears} from "date-fns";

interface BuyAndHoldSimulationProps {
    isOpen: boolean;
    onSubmit: (data: SimulationRequest) => void;
    onClose: () => void;
    isServerError: boolean;
    serverError: Error | null;
}

export function SimulationDialog({
                                     isOpen,
                                     onSubmit,
                                     onClose,
                                     serverError
                                 }: Readonly<BuyAndHoldSimulationProps>) {
    const {stockData} = useStockData();
    const {isLoading: isLoadingBrokers, isError: isErrorLoadingBrokers, brokers} = useBrokers();

    const [error, setError] = useState<Error | null>(serverError ?? null);
    const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(!!serverError);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setError(serverError ?? null);
        setShowErrorOverlay(!!serverError);
    }, [serverError]);

    const {control, handleSubmit, formState: {errors}} = useForm<SimulationRequest>({
        resolver: zodResolver(simulationRequestSchema),
        defaultValues: {
            brokerName: '',
            stockName: '',
            startDate: subYears(new Date(), 1),
            endDate: new Date(),
            startCapital: 10000,
            simulationType: simulationTypeOptions[0].value,
            riskTolerance: 20,
            indicators: []
        }
    });

    const simType = useWatch({control, name: "simulationType"}) as SimulationTypes | undefined;

    if (isLoadingBrokers) return <Loader/>;
    if (isErrorLoadingBrokers) return <ErrorAlert message="Error loading brokers"/>;

    const fieldConfigs: FormField<SimulationRequest>[] = [
        {
            name: "brokerName", type: "autocomplete", placeholder: "Broker", required: true,
            options: brokers?.map((b: Broker) => `${b.name} (Fee: ${b.transactionFee.toFixed(2)}€)`)
        },
        {
            name: "stockName", type: "autocomplete", placeholder: "Stock Name", required: true,
            options: stockData?.map((details) => details.companyName)
        },
        {name: "startDate", type: "date", placeholder: "Start Date", required: true},
        {name: "endDate", type: "date", placeholder: "End Date", required: true},
        {name: "startCapital", type: "number", placeholder: "Start Capital", required: true},
        {
            name: "simulationType", type: "select", placeholder: "Simulation Type", required: true,
            options: simulationTypeOptions
        },
        {
            name: "riskTolerance", type: "number", placeholder: "Risk Tolerance (%)", required: false,
            shouldRender: simType === SimulationTypes.RISK_BASED
        },
    ];

    const showSubmitError = (message: string) => {
        setError(new Error(message));
        setShowErrorOverlay(true);
        console.error(message);
        setIsSubmitting(false);
    };

    const trimBrokerName = (nameWithPriceInBrackets: string) => {
        return nameWithPriceInBrackets?.includes('(')
            ? nameWithPriceInBrackets.substring(0, nameWithPriceInBrackets.indexOf('(')).trim()
            : nameWithPriceInBrackets;
    }

    const onSubmitHandler = (data: SimulationRequest) => {
        setIsSubmitting(true);

        // check the stock data to map the stock name
        if (!stockData?.length) return showSubmitError("Stock data is not available.");
        const officialStockName = stockData.find(stock => stock.companyName === data.stockName)?.officialName;
        if (!officialStockName) return showSubmitError(`Could not find a matching stock for "${data.stockName}".`);

        const trimmedBrokerName = trimBrokerName(data.brokerName)
        onSubmit({...data, stockName: officialStockName, brokerName: trimmedBrokerName});
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <CloseButton onClose={onClose}/>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <ErrorOverlay isOpen={showErrorOverlay} setIsOpen={setShowErrorOverlay} error={error}/>
                <DialogTitle>Strategy Tester</DialogTitle>

                <DialogContent sx={{position: 'relative'}}>
                    <DialogContentText>
                        Fill in the form to test your strategy
                    </DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            {fieldConfigs.map(field => (
                                <FieldController
                                    key={field.name}
                                    control={control}
                                    errors={errors}
                                    field={field}
                                />
                            ))}
                        </Box>
                    </LocalizationProvider>
                    <TradingIndicatorsSection errors={errors} control={control}/>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Simulating..." : "Simulate"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}