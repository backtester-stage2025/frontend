import {useStockData} from "../hooks/useStockData.ts";
import {Box, Card} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {Loader} from "./Loader.tsx";

export function StockList() {
    const {isLoading, isError, stockData} = useStockData();
    const navigate = useNavigate();

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
                {
                    stockData.map((item: string) => (
                        <Card
                            sx={{
                                p: 3,
                                m: 1,
                                minWidth: '25%',
                                boxShadow: 3,
                                transition: '0.3s',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: 6,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                }
                            }}
                            key={item}
                            onClick={() => navigate(`/stock-overview?stockName=${item}`)}
                        >
                            {item}
                        </Card>
                    ))
                }
            </Box>
        </>
    );
}