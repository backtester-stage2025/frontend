import CanvasJSReact from '@canvasjs/react-stockcharts';
import {useStockQuotes} from '../../hooks/useStockQuotes';
import {StockQuote} from "../../model/StockQuote";
import {Loader} from "../Loader.tsx";
import {useMovingAverage} from "../../hooks/useMovingAverage.ts";
import {ChangeEvent, useEffect, useState} from 'react';

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

    const [inputPeriods, setInputPeriods] = useState({
        shortPeriod: 20,
        longPeriod: 50
    });

    const {
        isLoading: isLoadingMovingAverageShort,
        isError: isErrorMovingAverageShort,
        movingAverage: movingAverageShort
    } = useMovingAverage(stockName, dateRange.startDate, dateRange.endDate, periods.shortPeriod);

    const {isLoading: isLoadingMovingAverageLong, isError: isErrorMovingAverageLong, movingAverage: movingAverageLong} =
        useMovingAverage(stockName, dateRange.startDate, dateRange.endDate, periods.longPeriod);

    const handleShortPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setInputPeriods(prev => ({...prev, shortPeriod: value}));
    };

    const handleLongPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setInputPeriods(prev => ({...prev, longPeriod: value}));
    };

    const handleApplyClick = () => {
        setPeriods(inputPeriods);
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
        return <div>Error loading stock quotes for {stockName}</div>;
    }

    if (!stockQuotes || stockQuotes.length === 0) {
        return <div>No stock quotes available for {stockName}</div>;
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
        },
        subtitles: [
            {
                text: `(${new Date(stockQuotes[0].dateTime).toLocaleDateString()} - ${new Date(stockQuotes[stockQuotes.length - 1].dateTime).toLocaleDateString()})`,
                fontColor: "gray",
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
        width: "50em",
        height: "30em",
        margin: "auto",
    };

    return (
        <div>
            <div className="controls"
                 style={{
                     marginBottom: '20px',
                     display: 'flex',
                     justifyContent: 'center',
                     gap: '20px',
                     alignItems: 'center'
                 }}>
                <div>
                    <label htmlFor="shortPeriod">Short MA Period: </label>
                    <input
                        type="number"
                        id="shortPeriod"
                        value={inputPeriods.shortPeriod}
                        onChange={handleShortPeriodChange}
                        min="5"
                        max="100"
                    />
                </div>
                <div>
                    <label htmlFor="longPeriod">Long MA Period: </label>
                    <input
                        type="number"
                        id="longPeriod"
                        value={inputPeriods.longPeriod}
                        onChange={handleLongPeriodChange}
                        min="10"
                        max="200"
                    />
                </div>
                <button
                    onClick={handleApplyClick}
                    style={{
                        padding: '5px 15px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Apply
                </button>
            </div>
            <CanvasJSStockChart
                containerProps={containerProps}
                options={options}
            />
        </div>
    );
}