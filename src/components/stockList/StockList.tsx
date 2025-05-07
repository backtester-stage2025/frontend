import {useStockData} from "../../hooks/useStockData.ts";
import {Alert, Box, TextField, Typography} from "@mui/material";
import {useState} from "react";
import {Loader} from "../util/Loader.tsx";
import {StockCard} from "./StockCard.tsx";
import {StockDetails} from "../../model/StockDetails.ts";

export function StockList() {
    const {isLoading, isError, stockData, error} = useStockData();
    const [searchTerm, setSearchTerm] = useState("");

    if (isLoading) {
        return <Loader message="Loading available stocks..."/>;
    }

    if (isError) {
        return (
            <Alert severity="error" sx={{mt: 2, width: "100%"}}>
                Error loading stock list: {error?.message}
            </Alert>
        )
    }

    const filteredStocks = stockData?.filter((stock: StockDetails) => {
        const term = searchTerm.toLowerCase();
        const officialName = stock.officialName.toLowerCase();
        const companyName = stock.companyName.toLowerCase();
        const companyKey = companyName + ":" + officialName;
        return companyKey.includes(term);
    }

    ) || [];

    const visibleStocks = filteredStocks.slice(0, 5);
    const tooManyResults = filteredStocks.length > 5;

    return (
        <>
            <h1>Available Stocks</h1>

            <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                <TextField
                    label="Search stocks"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            {tooManyResults && (
                <Typography variant="subtitle1" align="center" sx={{mb: 2}}>
                    Showing 5 of {filteredStocks.length} results
                </Typography>
            )}

            <Box sx={{
                width: '80vw',
                maxWidth: 'lg',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                margin: '0 auto'
            }}>
                {visibleStocks.map((stockDetails: StockDetails) => (
                    <StockCard key={stockDetails.officialName} details={stockDetails}/>
                ))}
            </Box>
        </>
    );
}