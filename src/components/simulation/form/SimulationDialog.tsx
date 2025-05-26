import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController} from "./FieldController.tsx";
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
import {WeekdaySelector} from "./controller/WeekdaySelector.tsx";
import {Weekday} from "../../../model/Weekday.ts";
import {StockDetails} from "../../../model/StockDetails.ts";
import {getFieldNameStockDetails} from "../../../services/formatService.ts";
import { TOOLTIP_MESSAGES } from "../../../constants/tooltipMessages.ts";

interface BuyAndHoldSimulationProps {
    isOpen: boolean;
    onSubmit: (data: SimulationRequest) => void;
    onClose: () => void;
    isServerError: boolean;
    serverError: Error | null;
    initialValues: SimulationRequest | null;
}

export function SimulationDialog({
                                     isOpen,
                                     onSubmit,
                                     onClose,
                                     serverError,
                                     initialValues
                                 }: Readonly<BuyAndHoldSimulationProps>) {
    const {isLoading: isLoadingStockDate, isError: isErrorLoadingStockData, stockData} = useStockData();
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
        defaultValues: stockData && initialValues ? {
            ...initialValues,
            stockNames: initialValues.stockNames.map(officialName => {
                const stock = stockData.find(s => s.officialName === officialName);
                return stock ? getFieldNameStockDetails(stock) : '';
            })
        } : {
            brokerName: '',
            stockNames: [],
            startDate: subYears(new Date(), 1),
            endDate: new Date(),
            startCapital: 10000,
            simulationType: simulationTypeOptions[0].value,
            riskTolerance: 20,
            indicators: [],
            tradingWeekdays: Object.values(Weekday),
            transactionBufferPercentage: 0
        }
    });

    const simType = useWatch({control, name: "simulationType"}) as SimulationTypes | undefined;

    if (isLoadingBrokers || isLoadingStockDate) return <Loader/>;
    if (isErrorLoadingBrokers) return <ErrorAlert message="Error loading brokers"/>;
    if (isErrorLoadingStockData) return <ErrorAlert message="Error loading stock data"/>;

    const fieldConfigs: FormField<SimulationRequest>[] = [
        {
            name: "brokerName", type: "autocomplete", placeholder: "Broker", required: true,
            options: brokers?.map((b: Broker) => `${b.name} (Fee: ${b.transactionFee.toFixed(2)}€)`),
            tooltip: {
                title: TOOLTIP_MESSAGES.simulation.brokerTitle,
                description: TOOLTIP_MESSAGES.simulation.brokerInfo
            }
        },
        {
            name: "stockNames", type: "autocomplete", placeholder: "Stock Names", required: true,
            options: stockData?.map((sd: StockDetails) => getFieldNameStockDetails(sd)), multiple: true
        },
        {name: "startDate", type: "date", placeholder: "Start Date", required: true},
        {name: "endDate", type: "date", placeholder: "End Date", required: true},
        {name: "startCapital", type: "number", placeholder: "Start Capital", required: true},
        {
            name: "simulationType", type: "select", placeholder: "Position Adjustment", required: true,
            options: simulationTypeOptions,
            tooltip: {
                title: TOOLTIP_MESSAGES.simulation.simulationTypeTitle,
                description: TOOLTIP_MESSAGES.simulation.simulationTypeInfo
            }
        },
        {
            name: "riskTolerance", type: "number", placeholder: "Risk Tolerance (%)", required: false,
            shouldRender: simType === SimulationTypes.RISK_BASED,
            tooltip: {
                title: TOOLTIP_MESSAGES.simulation.riskToleranceTitle,
                description: TOOLTIP_MESSAGES.simulation.riskToleranceInfo
            }
        },
        {
            name: "transactionBufferPercentage", type: "number", placeholder: "Transaction Buffer (%)", required: true,
            tooltip: {
                description: TOOLTIP_MESSAGES.simulation.transactionBufferInfo
            }
        }
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

    const trimStockNames = (companyNameWithOfficialName: string): string => {
        const lastOpenParen = companyNameWithOfficialName.lastIndexOf('(');
        const lastCloseParen = companyNameWithOfficialName.indexOf(')', lastOpenParen);

        return companyNameWithOfficialName.substring(lastOpenParen + 1, lastCloseParen).trim();
    };

    const onSubmitHandler = (data: SimulationRequest) => {
        setIsSubmitting(true);

        // check the stock data to map the stock name
        if (!stockData?.length) return showSubmitError("Stock data is not available.");

        const trimmedStockNames = data.stockNames.map(data => trimStockNames(data))
        const trimmedBrokerName = trimBrokerName(data.brokerName)
        onSubmit({...data, stockNames: trimmedStockNames, brokerName: trimmedBrokerName});
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
                            <WeekdaySelector name={"tradingWeekdays"} control={control}/>
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