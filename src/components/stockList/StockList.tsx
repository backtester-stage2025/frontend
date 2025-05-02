import {useStockData} from "../../hooks/useStockData.ts";
import {Box} from "@mui/material";
import {Loader} from "../util/Loader.tsx";
import {StockCard} from "./StockCard.tsx";

export function StockList() {
    const {isLoading, isError, stockData} = useStockData();

    if (isLoading) {
        return <Loader message="Loading stocks..."/>;
    }

    if (isError) {
        return <div>Error</div>;
    }


    return (
        <>
            <h1>Available Stocks</h1>
            <Box sx={{
                width: '80vw',
                maxWidth: 'lg',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                margin: '0 auto'
            }}>
                {stockData.map((stockName:string) => <StockCard  key={stockName} name={stockName}/>)}
            </Box>
        </>
    );
}