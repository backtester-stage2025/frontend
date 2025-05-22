import {useStockData} from "../../hooks/useStockData.ts";
import {Box, Button, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {Loader} from "../util/Loader.tsx";
import {StockCard} from "./StockCard.tsx";
import {StockDetails} from "../../model/StockDetails.ts";
import {ErrorAlert} from "../util/Alerts.tsx";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth} from "../../context/AuthContext.tsx";
import {CsvUploadDialog} from "./CsvUploadDialog.tsx";

export function StockList() {
    const {isLoading, isError, stockData, error, refetch: refetchStockData} = useStockData();
    const [searchTerm, setSearchTerm] = useState("");
    const {isAuthenticated} = useAuth();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    useEffect(() => {
        refetchStockData()
    }, [isAuthenticated, refetchStockData]);

    if (isLoading)
        return <Loader message="Loading available stocks..."/>;

    if (isError)
        return <ErrorAlert message={`Error loading stock list: ${error?.message}`}/>

    const filteredStocks = Array.isArray(stockData)
        ? stockData.filter((stock: StockDetails) => {
            const term = searchTerm.toLowerCase();
            const officialName = stock.officialName.toLowerCase();
            const companyName = stock.companyName.toLowerCase();
            const companyKey = companyName + ":" + officialName;
            return companyKey.includes(term);
        })
        : [];

    const visibleStocks = filteredStocks.slice(0, 5);
    const tooManyResults = filteredStocks.length > 5;

    return (
        <>
            <h1>Available Stocks</h1>

            <Box sx={{display: 'flex', justifyContent: 'center', mb: 2, gap: 2, alignItems: 'center'}}>
                <TextField
                    label="Search stocks"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {isAuthenticated && (
                    <Button
                        variant="contained"
                        startIcon={<CloudUploadIcon/>}
                        sx={{height: '56px'}}
                        onClick={() => setUploadDialogOpen(true)}
                    >
                        Upload CSV
                    </Button>
                )}
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

            <CsvUploadDialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}/>
        </>
    );
}