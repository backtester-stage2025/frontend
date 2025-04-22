import CanvasJSReact from '@canvasjs/react-stockcharts';
import {useStockQuotes} from '../../hooks/useStockQuotes';
import {StockQuote} from "../../model/StockQuote";

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

interface StockChartProps {
    stockName: string;
}

export function StockChart({stockName}: StockChartProps) {
    const {isLoading, isError, stockQuotes} = useStockQuotes(stockName);

    if (isLoading) {
        return <div>Loading stock quotes for {stockName}...</div>;
    }

    if (isError) {
        return <div>Error loading stock quotes for {stockName}</div>;
    }

    if (!stockQuotes || stockQuotes.length === 0) {
        return <div>No stock quotes available for {stockName}</div>;
    }

    const dataPoints = stockQuotes?.map((quote: StockQuote) => ({
        x: new Date(quote.dateTime),
        y: quote.price,
    }));

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
        animationEnabled: true,
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
                        dataPoints: dataPoints,
                    },
                ],
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
    };

    const containerProps = {
        width: "50em",
        height: "30em",
        margin: "auto",
    };

    return (
        <div>
            <CanvasJSStockChart containerProps={containerProps} options={options}/>
        </div>
    );
}