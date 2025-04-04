import {useStockData} from "../hooks/useStockData.ts";


export function StockList() {
    const {isLoading, isError, stockData} = useStockData();

    if (isError) {
        return <div>Error</div>;
    }

    if(isLoading) {
        return <div>Loading...</div>;
    }

    console.log(stockData);

    return (
        stockData.map((item: string) => (
            <div>${item}</div>
        ))
    )
}