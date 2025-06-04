import {useSearchParams, useNavigate} from "react-router-dom";
import {StockChart} from "./StockChart";
import {Box, Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function StockOverview() {
    const [searchParams] = useSearchParams();
    const stockName = searchParams.get("stockName");
    const navigate = useNavigate();

    if (!stockName) {
        return <div>No stock selected</div>;
    }

    return (
        <Box sx={{px: 3}}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/stock-list")}
                    sx={{mt: 2}}
                >
                    Back
                </Button>
            </Box>
            <StockChart stockName={stockName} />
        </Box>
    );
}