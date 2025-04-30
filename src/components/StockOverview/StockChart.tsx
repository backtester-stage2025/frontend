import CanvasJSReact from '@canvasjs/react-stockcharts';
import {useStockQuotes} from '../../hooks/useStockQuotes';
import {StockQuote} from "../../model/StockQuote";
import {Loader} from "../Loader.tsx";
import {useMovingAverage} from "../../hooks/useMovingAverage.ts";
import {useEffect, useState} from 'react';
import {Alert, Paper, Typography} from '@mui/material';
import {ShowChart} from '@mui/icons-material';
import {MovingAverageControls} from './MovingAverageControls';

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

interface StockChartProps {
    stockName: string;
}

export function StockChart({stockName}: Readonly<StockChartProps>) {
    const {isLoading: isLoadingStockQuotes, isError: isErrorStockQuotes, stockQuotes} = useStockQuotes(stockName);

    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    });

    const [periods, setPeriods] = useState({
        shortPeriod: 20,
        longPeriod: 50
    });

    const {
        isLoading: isLoadingMovingAverageShort,
        isError: isErrorMovingAverageShort,
        movingAverage: movingAverageShort
    } = useMovingAverage(stockName, dateRange.startDate, dateRange.endDate, periods.shortPeriod);

    const {
        isLoading: isLoadingMovingAverageLong,
        isError: isErrorMovingAverageLong,
        movingAverage: movingAverageLong
    } = useMovingAverage(stockName, dateRange.startDate, dateRange.endDate, periods.longPeriod);

    const handlePeriodsChange = (shortPeriod: number, longPeriod: number) => {
        setPeriods({
            shortPeriod,
            longPeriod
        });
    };

    useEffect(() => {
        if (stockQuotes && stockQuotes.length > 0) {
            const longPeriodPadding = Math.max(periods.shortPeriod, periods.longPeriod) + 10;

            const firstDate = new Date(stockQuotes[0].dateTime);
            const paddedStartDate = new Date(firstDate);
            paddedStartDate.setDate(paddedStartDate.getDate() - longPeriodPadding);

            const lastDate = new Date(stockQuotes[stockQuotes.length - 1].dateTime);

            setDateRange({
                startDate: paddedStartDate.toISOString().split('T')[0],
                endDate: lastDate.toISOString().split('T')[0],
            });
        }
    }, [stockQuotes]);

    if (isLoadingStockQuotes || isLoadingMovingAverageShort || isLoadingMovingAverageLong) {
        return <Loader message={`Loading stock quotes for ${stockName}`}/>;
    }

    if (isErrorStockQuotes || isErrorMovingAverageShort || isErrorMovingAverageLong) {
        return (
            <Alert severity="error" sx={{mt: 2, width: "100%"}}>
                Error loading stock quotes for {stockName}. Please try again later.
            </Alert>
        );
    }

    if (!stockQuotes || stockQuotes.length === 0) {
        return (
            <Alert severity="warning" sx={{mt: 2, width: "100%"}}>
                No stock quotes available for {stockName}. Please try a different stock.
            </Alert>
        );
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

    const options = {
        theme: "light2",
        title: {
            text: `Stock Quotes for ${stockName}`,
            fontFamily: "Roboto, sans-serif",
            fontSize: 24,
        },
        subtitles: [
            {
                text: `(${new Date(stockQuotes[0].dateTime).toLocaleDateString()} - ${new Date(stockQuotes[stockQuotes.length - 1].dateTime).toLocaleDateString()})`,
                fontColor: "gray",
                fontFamily: "Roboto, sans-serif",
            },
        ],
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
                    title: "Value",
                    crosshair: {
                        enabled: true,
                    },
                },
                data: [
                    {
                        type: "spline",
                        name: "Stock Price",
                        showInLegend: true,
                        dataPoints: dataPoints,
                    },
                    {
                        type: "line",
                        name: `${periods.shortPeriod}-Day MA`,
                        showInLegend: true,
                        color: "#ff7300",
                        lineThickness: 2,
                        dataPoints: movingAverageShortDataPoints,
                    },
                    {
                        type: "line",
                        name: `${periods.longPeriod}-Day MA`,
                        showInLegend: true,
                        color: "#0077ff",
                        lineThickness: 2,
                        dataPoints: movingAverageLongDataPoints,
                    },
                ],
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

    const containerProps = {
        width: "90vh",
        height: "50vh",
        margin: "auto",
    };

    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 2}}>
            <Typography variant="h5" component="h2" gutterBottom sx={{display: 'flex', alignItems: 'center'}}>
                <ShowChart sx={{mr: 1}}/> {stockName} Moving Average Analysis
            </Typography>

            <MovingAverageControls
                initialShortPeriod={periods.shortPeriod}
                initialLongPeriod={periods.longPeriod}
                onPeriodsChange={handlePeriodsChange}
            />

            <CanvasJSStockChart
                containerProps={containerProps}
                options={options}
            />
        </Paper>
    );
}