import {useMovingAverage} from "../../hooks/useStockAnalysis.ts";
import {Loader} from "../util/Loader.tsx";
import {StockQuote} from "../../model/StockQuote.ts";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import {ErrorAlert} from "../util/Alerts.tsx";
import {ChartSettings} from "./StockChart.tsx";
import {subMonths} from "date-fns";
import {useCurrencyForStock} from "../../hooks/useCurrencyForStock.ts";
import {CurrencyTypeDisplay} from "../../model/CurrencyType.ts";

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

interface MovingAverageChartProps {
    stockName: string;
    stockQuotes: StockQuote[];
    dateRange: {
        startDate: string;
        endDate: string;
    }
    settings: ChartSettings
}

export function MovingAverageChart({stockName, stockQuotes, dateRange, settings}: Readonly<MovingAverageChartProps>) {
    const currencyType = useCurrencyForStock(stockName);
    const currencySymbol = CurrencyTypeDisplay[currencyType];

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

    if (isLoadingMovingAverageShort || isLoadingMovingAverageLong) {
        return <Loader message={`Loading stock analysis for ${stockName}`}/>;
    }

    if (isErrorMovingAverageShort || isErrorMovingAverageLong) {
        return <ErrorAlert message={`Error loading stock data for ${stockName}`}/>;
    }

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

    const endDate = new Date(stockQuotes[stockQuotes.length - 1].dateTime);
    const idealStartDate = subMonths(endDate, 6);
    const firstDate = new Date(stockQuotes[0].dateTime);
    const startDate = idealStartDate > firstDate ? idealStartDate : firstDate;

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
                    title: `Price (${currencySymbol})`,
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
                startValue: startDate,
                endValue: endDate,
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
                minimum: startDate,
                maximum: endDate,
            },
        },
    };

    const containerProps = {
        width: "100%",
        height: "60vh",
        margin: "auto",
    };

    return (
        <CanvasJSStockChart
            containerProps={containerProps}
            options={priceChartOptions}
        />
    )
}