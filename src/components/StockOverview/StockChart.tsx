import CanvasJSReact from '@canvasjs/react-stockcharts';
import { useStockQuotes } from '../../hooks/useStockQuotes';

const CanvasJSStockChart = CanvasJSReact.CanvasJSStockChart;

interface StockChartProps {
    stockName: string;
}

export function StockChart({ stockName }: StockChartProps) {
    const { isLoading, isError, stockQuotes } = useStockQuotes(stockName);

    if (isLoading) {
        return <div>Loading stock quotes for {stockName}...</div>;
    }

    if (isError) {
        return <div>Error loading stock quotes for {stockName}</div>;
    }

    const dataPoints = stockQuotes.map((quote: { date: string; value: number }) => ({
        x: new Date(quote.date),
        y: quote.value,
    }));

    const options = {
        theme: "light2",
        title: {
            text: `Stock Quotes for ${stockName}`,
        },
        animationEnabled: true,
        exportEnabled: true,
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
                startValue: new Date(stockQuotes[0].date),
                endValue: new Date(stockQuotes[stockQuotes.length - 1].date),
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
        width: "100%",
        height: "450px",
        margin: "auto",
    };

    return (
        <div>
            <CanvasJSStockChart containerProps={containerProps} options={options} />
        </div>
    );
}