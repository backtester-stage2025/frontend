import {useMacd, useSignal} from "../../hooks/useStockAnalysis.ts";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import {StockQuote} from "../../model/StockQuote.ts";
import {ChartSettings} from "./StockChart.tsx";
import {Loader} from "../util/Loader.tsx";
import {ErrorAlert} from "../util/Alerts.tsx";


const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;


interface MacdChartProps {
    stockName: string;
    stockQuotes: StockQuote[];
    dateRange: {
        startDate: string;
        endDate: string;
    }
    settings: ChartSettings
}


export function MacdChart({stockName, stockQuotes, dateRange, settings}: Readonly<MacdChartProps>) {
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

    if (isLoadingMacd || isLoadingSignal) {
        return <Loader message={`Loading stock analysis for ${stockName}`}/>;
    }

    if (isErrorMacd || isErrorSignal) {
        return <ErrorAlert message={`Error loading stock data for ${stockName}`}/>;
    }

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

    const macdContainerProps = {
        width: "100%",
        height: "40vh",
        margin: "auto",
    };

    return (
        <CanvasJSStockChart
            options={macdChartOptions}
            containerProps={macdContainerProps}
        />
    )
}