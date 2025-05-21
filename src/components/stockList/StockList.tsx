import {useStockData} from "../../hooks/useStockData.ts";
import {Alert, Box, Button, Snackbar, TextField, Typography} from "@mui/material";
import {ChangeEvent, useEffect, useState} from "react";
import {Loader} from "../util/Loader.tsx";
import {StockCard} from "./StockCard.tsx";
import {StockDetails} from "../../model/StockDetails.ts";
import {ErrorAlert} from "../util/Alerts.tsx";
import {useUploadCsv} from "../../hooks/useUploadCsv.ts";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth} from "../../context/AuthContext.tsx";

export function StockList() {
    const {isLoading, isError, stockData, error} = useStockData();
    const [searchTerm, setSearchTerm] = useState("");
    const {sendRequest, isRunning, isError: isUploadError, error: uploadError} = useUploadCsv();
    const {isAuthenticated} = useAuth();
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadResponse, setUploadResponse] = useState<string>("");
    const [showUploadError, setShowUploadError] = useState(false);

    useEffect(() => {
        if (isUploadError) setShowUploadError(true);
    }, [isUploadError]);

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

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            sendRequest(file, {
                onSuccess: (response) => {
                    setUploadSuccess(true);
                    setUploadResponse(`Successfully uploaded ${response.stockName} with ${response.dataPointsCount} data points from ${response.startDate} to ${response.endDate}`);
                    // Reset the file input
                    event.target.value = '';
                }
            });
        }
    };

    const handleCloseSnackbar = () => {
        setUploadSuccess(false);
    };

    const handleCloseUploadError = () => {
        setShowUploadError(false);
    };


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
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon/>}
                        disabled={isRunning}
                        sx={{height: '56px'}}
                    >
                        {isRunning ? "Uploading..." : "Upload CSV"}
                        <input
                            type="file"
                            hidden
                            accept=".csv"
                            onChange={handleFileUpload}
                        />
                    </Button>
                )}
            </Box>

            {isUploadError && (
                <Snackbar
                    open={showUploadError}
                    autoHideDuration={6000}
                    onClose={handleCloseUploadError}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert onClose={handleCloseUploadError} severity="error" sx={{width: '100%', mt: 6}}>
                        Error uploading CSV: {uploadError?.message}
                    </Alert>
                </Snackbar>
            )}

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

            <Snackbar
                open={uploadSuccess}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%', mt: 6}}>
                    {uploadResponse}
                </Alert>
            </Snackbar>
        </>
    );
}