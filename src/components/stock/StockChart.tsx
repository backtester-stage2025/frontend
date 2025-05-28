import CanvasJSReact from '@canvasjs/react-stockcharts';
import {useStockQuotes} from '../../hooks/useStockQuotes';
import {StockQuote} from "../../model/StockQuote";
import {Loader} from "../util/Loader.tsx";
import {useMacd, useMovingAverage, useSignal} from "../../hooks/useStockAnalysis.ts";
import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    Paper,
    Stack,
    Switch,
    Tooltip,
    Typography
} from '@mui/material';
import {Analytics, Settings, ShowChart, TrendingUp} from '@mui/icons-material';
import {PeriodControls} from './PeriodControls.tsx';
import {ErrorAlert, WarningAlert} from "../util/Alerts.tsx";

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

interface ChartSettings {
    showMovingAverages: boolean;
    showMacd: boolean;
    shortPeriod: number;
    longPeriod: number;
}

interface StockChartProps {
    stockName: string;
}

export function StockChart({stockName}: Readonly<StockChartProps>) {
    const {
        isLoading: isLoadingStockQuotes,
        isError: isErrorStockQuotes,
        stockQuotes,
        error
    } = useStockQuotes(stockName);

    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    });

    const [settings, setSettings] = useState<ChartSettings>({
        showMovingAverages: true,
        showMacd: false,
        shortPeriod: 12,
        longPeriod: 26
    });

    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [tempSettings, setTempSettings] = useState<ChartSettings>(settings);

    // Data hooks - always fetch but conditionally use
    const {
        isLoading: isLoadingMovingAverageShort,
        isError: isErrorMovingAverageShort,
        movingAverage: movingAverageShort
    } = useMovingAverage(stockName, dateRange.startDate, dateRange.endDate, settings.shortPeriod);

    const {
        isLoading: isLoadingMovingAverageLong,
        isError: isErrorMovingAverageLong,
        movingAverage: movingAverageLong
    } = useMovingAverage(stockName, dateRange.startDate, dateRange.endDate, settings.longPeriod);

    const {
        isLoading: isLoadingMacd,
        isError: isErrorMacd,
        macd
    } = useMacd(stockName, dateRange.startDate, dateRange.endDate, settings.shortPeriod, settings.longPeriod);

    const {
        isLoading: isLoadingSignal,
        isError: isErrorSignal,
        signal
    } = useSignal(stockName, dateRange.startDate, dateRange.endDate, settings.shortPeriod, settings.longPeriod);

    useEffect(() => {
        if (stockQuotes && stockQuotes.length > 0) {
            const longPeriodPadding = Math.max(settings.shortPeriod, settings.longPeriod) + 10;

            const firstDate = new Date(stockQuotes[0].dateTime);
            const paddedStartDate = new Date(firstDate);
            paddedStartDate.setDate(paddedStartDate.getDate() - longPeriodPadding);

            const lastDate = new Date(stockQuotes[stockQuotes.length - 1].dateTime);

            setDateRange({
                startDate: paddedStartDate.toISOString().split('T')[0],
                endDate: lastDate.toISOString().split('T')[0],
            });
        }
    }, [stockQuotes, settings.shortPeriod, settings.longPeriod]);

    const isLoadingAnyData = isLoadingStockQuotes ||
        (settings.showMovingAverages && (isLoadingMovingAverageShort || isLoadingMovingAverageLong)) ||
        (settings.showMacd && (isLoadingMacd || isLoadingSignal));

    const isErrorAnyData = isErrorStockQuotes ||
        (settings.showMovingAverages && (isErrorMovingAverageShort || isErrorMovingAverageLong)) ||
        (settings.showMacd && (isErrorMacd || isErrorSignal));

    if (isLoadingAnyData)
        return <Loader message={`Loading stock analysis for ${stockName}`}/>;

    if (isErrorAnyData)
        return <ErrorAlert message={`Error loading stock data for ${stockName}: ${error?.message}`}/>;

    if (!stockQuotes || stockQuotes.length === 0)
        return <WarningAlert message={`No stock quotes available for ${stockName}. Please try a different stock.`}/>

    // Data preparation
    const dataPoints = stockQuotes?.map((quote: StockQuote) => ({
        x: new Date(quote.dateTime),
        y: quote.price,
    }));

    const movingAverageShortDataPoints = movingAverageShort ?
        Object.entries(movingAverageShort).map(([dateStr, value]) => ({
            x: new Date(dateStr),
            y: value
        })) : [];

    const movingAverageLongDataPoints = movingAverageLong ?
        Object.entries(movingAverageLong).map(([dateStr, value]) => ({
            x: new Date(dateStr),
            y: value
        })) : [];

    const macdDataPoints = macd ?
        Object.entries(macd).map(([dateStr, value]) => ({
            x: new Date(dateStr),
            y: value
        })) : [];

    const signalDataPoints = signal ?
        Object.entries(signal).map(([dateStr, value]) => ({
            x: new Date(dateStr),
            y: value
        })) : [];

    // Main price chart configuration
    const getPriceChartData = () => {
        const data = [
            {
                type: "spline",
                name: "Stock Price",
                showInLegend: true,
                dataPoints: dataPoints,
                color: "#2E86AB",
                lineThickness: 2
            }
        ];

        if (settings.showMovingAverages) {
            data.push(
                {
                    type: "line",
                    name: `MA ${settings.shortPeriod}`,
                    showInLegend: true,
                    color: "#F24236",
                    lineThickness: 2,
                    dataPoints: movingAverageShortDataPoints,
                },
                {
                    type: "line",
                    name: `MA ${settings.longPeriod}`,
                    showInLegend: true,
                    color: "#A23B72",
                    lineThickness: 2,
                    dataPoints: movingAverageLongDataPoints,
                }
            );
        }

        return data;
    };

    const getMacdData = () => {
        return [
            {
                type: "line",
                name: "MACD Line",
                showInLegend: true,
                color: "#F18F01",
                lineThickness: 2,
                dataPoints: macdDataPoints,
            },
            {
                type: "line",
                name: "Signal Line",
                showInLegend: true,
                color: "#C73E1D",
                lineThickness: 2,
                lineDashType: "dash",
                dataPoints: signalDataPoints,
            }
        ]
    }

    const priceChartOptions = {
        theme: "light2",
        title: {
            text: `${stockName} Stock Analysis`,
            fontFamily: "Roboto, sans-serif",
            fontSize: 20,
        },
        animationEnabled: false,
        charts: [
            {
                axisX: {
                    title: "Date",
                    valueFormatString: "MMM DD, YYYY",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true,
                    },
                },
                axisY: {
                    title: "Price ($)",
                    crosshair: {
                        enabled: true,
                    },
                },
                data: getPriceChartData(),
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: false,
                    fontFamily: "Roboto, sans-serif",
                },
            },
        ],
        rangeSelector: {
            inputFields: {
                startValue: new Date(stockQuotes[0].dateTime),
                endValue: new Date(stockQuotes[stockQuotes.length - 1].dateTime),
                valueFormatString: "MMM DD, YYYY",
            },
            buttons: [
                {
                    label: "1M",
                    range: 1,
                    rangeType: "month",
                },
                {
                    label: "3M",
                    range: 3,
                    rangeType: "month",
                },
                {
                    label: "6M",
                    range: 6,
                    rangeType: "month",
                },
                {
                    label: "All",
                    rangeType: "all",
                },
            ],
        },
        navigator: {
            enabled: true,
            slider: {
                minimum: new Date(stockQuotes[0].dateTime),
                maximum: new Date(stockQuotes[stockQuotes.length - 1].dateTime)
            }
        }
    };

    const macdChartOptions = {
        theme: "light2",
        title: {
            text: `${stockName} Stock Analysis`,
            fontFamily: "Roboto, sans-serif",
            fontSize: 20,
        },
        animationEnabled: false,
        charts: [
            {
                axisX: {
                    title: "Date",
                    valueFormatString: "MMM DD, YYYY",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true,
                    },
                },
                axisY: {
                    title: "Price ($)",
                    crosshair: {
                        enabled: true,
                    },
                },
                data: getMacdData(),
                legend: {
                    cursor: "pointer",
                    verticalAlign: "top",
                    horizontalAlign: "center",
                    dockInsidePlotArea: false,
                    fontFamily: "Roboto, sans-serif",
                },
            },
        ],
        rangeSelector: {
            inputFields: {
                startValue: new Date(stockQuotes[0].dateTime),
                endValue: new Date(stockQuotes[stockQuotes.length - 1].dateTime),
                valueFormatString: "MMM DD, YYYY",
            },
            buttons: [
                {
                    label: "1M",
                    range: 1,
                    rangeType: "month",
                },
                {
                    label: "3M",
                    range: 3,
                    rangeType: "month",
                },
                {
                    label: "6M",
                    range: 6,
                    rangeType: "month",
                },
                {
                    label: "All",
                    rangeType: "all",
                },
            ],
        },
        navigator: {
            enabled: true,
            slider: {
                minimum: new Date(stockQuotes[0].dateTime),
                maximum: new Date(stockQuotes[stockQuotes.length - 1].dateTime)
            }
        }
    };

    // MACD chart configuration
    const macdChartOptionsqsdf = {
        theme: "light2",
        title: {
            text: `MACD Analysis (${settings.shortPeriod}/${settings.longPeriod})`,
            fontFamily: "Roboto, sans-serif",
            fontSize: 16,
        },
        animationEnabled: false,
        axisX: {
            title: "Date",
            valueFormatString: "MMM DD, YYYY",
            crosshair: {
                enabled: true,
                snapToDataPoint: true,
            },
        },
        axisY: {
            title: "MACD Value",
            crosshair: {
                enabled: true,
            },
            gridThickness: 1,
            gridColor: "#E0E0E0"
        },
        data: [
            {
                type: "line",
                name: "MACD Line",
                showInLegend: true,
                color: "#F18F01",
                lineThickness: 2,
                dataPoints: macdDataPoints,
            },
            {
                type: "line",
                name: "Signal Line",
                showInLegend: true,
                color: "#C73E1D",
                lineThickness: 2,
                lineDashType: "dash",
                dataPoints: signalDataPoints,
            }
        ],
        rangeSelector: {
            inputFields: {
                startValue: new Date(stockQuotes[0].dateTime),
                endValue: new Date(stockQuotes[stockQuotes.length - 1].dateTime),
                valueFormatString: "MMM DD, YYYY",
            },
            buttons: [
                {
                    label: "1M",
                    range: 1,
                    rangeType: "month",
                },
                {
                    label: "3M",
                    range: 3,
                    rangeType: "month",
                },
                {
                    label: "6M",
                    range: 6,
                    rangeType: "month",
                },
                {
                    label: "All",
                    rangeType: "all",
                },
            ],
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "center",
            dockInsidePlotArea: false,
            fontFamily: "Roboto, sans-serif",
        },
    };

    const handleConfigSave = () => {
        setSettings(tempSettings);
        setConfigDialogOpen(false);
    };

    const handleConfigCancel = () => {
        setTempSettings(settings);
        setConfigDialogOpen(false);
    };

    const handlePeriodsChange = (shortPeriod: number, longPeriod: number) => {
        setTempSettings(prev => ({
            ...prev,
            shortPeriod,
            longPeriod
        }));
    };

    const getActiveIndicators = () => {
        const indicators = [];
        if (settings.showMovingAverages) {
            indicators.push(`MA (${settings.shortPeriod}/${settings.longPeriod})`);
        }
        if (settings.showMacd) {
            indicators.push(`MACD (${settings.shortPeriod}/${settings.longPeriod})`);
        }
        return indicators;
    };

    const containerProps = {
        width: "100%",
        height: "60vh",
        margin: "auto",
    };

    const macdContainerProps = {
        width: "100%",
        height: "40vh",
        margin: "auto",
    };

    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 2}}>
            {/* Header */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant="h5" component="h2" sx={{display: 'flex', alignItems: 'center'}}>
                    <ShowChart sx={{mr: 1}}/> {stockName} Technical Analysis
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Stack direction="row" spacing={1}>
                        {getActiveIndicators().map((indicator, index) => (
                            <Chip
                                key={index}
                                label={indicator}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                        {getActiveIndicators().length === 0 && (
                            <Chip
                                label="No indicators active"
                                size="small"
                                color="default"
                                variant="outlined"
                            />
                        )}
                    </Stack>

                    <Tooltip title="Configure Chart Settings">
                        <IconButton
                            onClick={() => setConfigDialogOpen(true)}
                            color="primary"
                            sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                '&:hover': {bgcolor: 'primary.main'}
                            }}
                        >
                            <Settings/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Price Chart */}
            <Box sx={{mb: settings.showMacd ? 3 : 0}}>
                <CanvasJSStockChart
                    containerProps={containerProps}
                    options={priceChartOptions}
                />
            </Box>

            {/* MACD Chart */}
            {settings.showMacd && (
                <Box sx={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#FAFAFA'
                }}>
                    <Typography variant="h6" sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <Analytics sx={{mr: 1, color: 'primary.main'}}/>
                        MACD Indicator
                    </Typography>
                    <CanvasJSStockChart
                        options={macdChartOptions}
                        containerProps={macdContainerProps}
                    />
                </Box>
            )}

            {/* Configuration Dialog */}
            <Dialog
                open={configDialogOpen}
                onClose={handleConfigCancel}
                maxWidth="md"
                fullWidth
                slotProps={{
                    paper: {
                        sx: {borderRadius: 2}
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText'
                }}>
                    <Settings sx={{mr: 1}}/>
                    Chart Configuration
                </DialogTitle>

                <DialogContent sx={{pt: 3}}>
                    <Box sx={{mb: 4}}>
                        <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center'}}>
                            <TrendingUp sx={{mr: 1}}/>
                            Technical Indicators
                        </Typography>

                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={tempSettings.showMovingAverages}
                                        onChange={(e) => setTempSettings(prev => ({
                                            ...prev,
                                            showMovingAverages: e.target.checked
                                        }))}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight={500}>
                                            Moving Averages
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Display short and long-term moving averages on the price chart
                                        </Typography>
                                    </Box>
                                }
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={tempSettings.showMacd}
                                        onChange={(e) => setTempSettings(prev => ({
                                            ...prev,
                                            showMacd: e.target.checked
                                        }))}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight={500}>
                                            MACD Indicator
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Show MACD and Signal lines in a separate chart below
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Stack>
                    </Box>

                    <Divider sx={{my: 3}}/>

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Period Settings
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                            Configure the periods used for moving averages and MACD calculations
                        </Typography>

                        <PeriodControls
                            initialShortPeriod={tempSettings.shortPeriod}
                            initialLongPeriod={tempSettings.longPeriod}
                            onPeriodsChange={handlePeriodsChange}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{p: 3, pt: 0}}>
                    <Button onClick={handleConfigCancel} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfigSave}
                        variant="contained"
                        color="primary"
                        sx={{minWidth: 100}}
                    >
                        Apply Settings
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}