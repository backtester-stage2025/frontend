import {useStockData} from "../hooks/useStockData.ts";
import {Box, Card} from "@mui/material";


export function StockList() {
    const {isLoading, isError, stockData} = useStockData();

    if (isError) {
        return <div>Error</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Available Stocks</h1>
            <Box sx={{
                width: '80vw',
                maxWidth: 'lg',
                display: 'flex',
                flexWrap: 'wrap'
            }}>

                {
                    stockData.map((item: string) => (
                        <Card sx={{
                            p: 3,
                            m: 1,
                            minWidth: '25%',
                            boxShadow: 3,
                            // Hover effect
                            transition: '0.3s',
                            cursor: 'pointer',
                            '&:hover': {
                                boxShadow: 6,
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            }
                        }} key={item}>{item}</Card>
                    ))
                }
            </Box>
        </div>


    )
}