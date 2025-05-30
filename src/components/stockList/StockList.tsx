import {useStockData} from "../../hooks/useStockData.ts";
import {Box, Button, Grid, Tab, Tabs, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {Loader} from "../util/Loader.tsx";
import {StockCard} from "./StockCard.tsx";
import {StockDetails} from "../../model/StockDetails.ts";
import {ErrorAlert} from "../util/Alerts.tsx";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useAuth} from "../../context/AuthContext.tsx";
import {CsvUploadDialog} from "./csv/CsvUploadDialog.tsx";
import {useDeleteCsv} from "../../hooks/useCsvMutations.ts";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {DeleteConfirmationDialog} from "./DeleteConfirmationDialog.tsx";

export function StockList() {
    const {isLoading, isError, stockData, error, refetch: refetchStockData} = useStockData();
    const {sendRequest: deleteStock, isRunning, isError: isErrorDeleteCsv, error: deleteCsvError} = useDeleteCsv();
    const [searchTerm, setSearchTerm] = useState("");
    const {isAuthenticated} = useAuth();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [stockToDelete, setStockToDelete] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success" as "success" | "error"});
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (isErrorDeleteCsv && deleteCsvError && !deleteDialogOpen) {
            setSnackbar({
                open: true,
                message: `Error deleting stock: ${deleteCsvError.message || "Unknown error"}`,
                severity: "error"
            });
        }
    }, [isErrorDeleteCsv, deleteCsvError, deleteDialogOpen]);

    useEffect(() => {
        refetchStockData();
    }, [isAuthenticated, refetchStockData]);

    const handleDeleteConfirm = (officialName: string) => {
        setStockToDelete(officialName);
        setDeleteDialogOpen(true);
    };

    const handleDeleteStock = () => {
        if (!stockToDelete) return;

        try {
            deleteStock(stockToDelete, {
                onSuccess: () => {
                    setSnackbar({
                        open: true,
                        message: `Successfully deleted ${stockToDelete}`,
                        severity: "success"
                    });
                    refetchStockData();
                },
                onError: (error) => {
                    setSnackbar({
                        open: true,
                        message: `Error deleting stock: ${error?.message || "Unknown error"}`,
                        severity: "error"
                    });
                },
                onSettled: () => {
                    setDeleteDialogOpen(false);
                    setStockToDelete(null);
                }
            });
        } catch (e) {
            setSnackbar({
                open: true,
                message: `Unexpected error: ${e instanceof Error ? e.message : "Unknown error"}`,
                severity: "error"
            });
            setDeleteDialogOpen(false);
            setStockToDelete(null);
        }
    };

    if (isLoading)
        return <Loader message="Loading available stocks..."/>;

    if (isError)
        return <ErrorAlert message={`Error loading stock list: ${error?.message}`}/>;

    const allStocks = Array.isArray(stockData) ? stockData : [];

    const filteredStocks = allStocks.filter((stock: StockDetails) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            stock.officialName.toLowerCase().includes(term) ||
            stock.companyName.toLowerCase().includes(term) ||
            stock.ticker.toLowerCase().includes(term);

        if (tabValue === 1) return matchesSearch && stock.publiclyAvailable;
        if (tabValue === 2) return matchesSearch && !stock.publiclyAvailable;
        return matchesSearch;
    });

    return (
        <>
            <Box sx={{textAlign: 'center', mb: 4}}>
                <Typography variant="h4" component="h1" sx={{fontWeight: 'bold', mb: 1}}>
                    Available Stocks
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Browse and manage available stock data
                </Typography>
            </Box>

            <Box
                sx={{display: 'flex', justifyContent: 'center', mb: 3, gap: 2, alignItems: 'center', flexWrap: 'wrap'}}>
                <TextField
                    label="Search stocks"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="medium"
                    sx={{minWidth: '280px'}}
                />

                {isAuthenticated && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUploadIcon/>}
                        sx={{height: '56px'}}
                        onClick={() => setUploadDialogOpen(true)}
                    >
                        Upload CSV
                    </Button>
                )}
            </Box>

            <Box sx={{borderBottom: 1, borderColor: 'divider', width: '100%', maxWidth: 500, mx: 'auto', mb: 3}}>
                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered>
                    <Tab label={`All (${allStocks.length})`}/>
                    <Tab label={`Public (${allStocks.filter(s => s.publiclyAvailable).length})`}/>
                    <Tab label={`Your Uploads (${allStocks.filter(s => !s.publiclyAvailable).length})`}/>
                </Tabs>
            </Box>

            {filteredStocks.length === 0 ? (
                <Box sx={{textAlign: 'center', py: 4}}>
                    <Typography variant="h6" color="text.secondary">
                        No stocks found matching your criteria
                    </Typography>
                </Box>
            ) : (
                <Box sx={{width: '95%', maxWidth: 1200, mx: 'auto'}}>
                    <Grid container spacing={2} justifyContent="center">
                        {filteredStocks.map((stockDetails: StockDetails) => (
                            <Grid size={{xs: 12, sm: 6, md: 4}} key={stockDetails.officialName}>
                                <StockCard
                                    details={stockDetails}
                                    onDelete={!stockDetails.publiclyAvailable ? handleDeleteConfirm : undefined}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <CsvUploadDialog
                open={uploadDialogOpen}
                onClose={() => {
                    setUploadDialogOpen(false);
                    refetchStockData();
                }}
            />

            <DeleteConfirmationDialog deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen}
                                      isRunning={isRunning} isErrorDeleteCsv={isErrorDeleteCsv}
                                      deleteCsvError={deleteCsvError} handleDeleteStock={handleDeleteStock}/>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    sx={{width: '100%'}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}