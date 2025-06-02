import {useNavigate} from "react-router-dom";
import {Box, Card, CardContent, Chip, IconButton, Typography} from "@mui/material";
import {StockDetails} from "../../model/StockDetails.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';

interface StockCardProps {
    details: StockDetails;
    onDelete?: (officialName: string) => void;
}

export function StockCard({details, onDelete}: Readonly<StockCardProps>) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/stock-overview?stockName=${details.officialName}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(details.officialName);
        }
    };

    return (
        <Card
            sx={{
                p: 2,
                m: 1,
                minWidth: '280px',
                maxWidth: '350px',
                minHeight: '150px',
                maxHeight: '150px',
                boxShadow: 3,
                transition: '0.3s',
                cursor: 'pointer',
                borderLeft: details.publiclyAvailable ? '4px solid #4caf50' : '4px solid #2196f3',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                }
            }}
            key={details.officialName}
            onClick={handleClick}
        >
            <CardContent sx={{p: 1}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{mb: 0.5}}>
                            {details.companyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {details.ticker} • {details.exchange}
                        </Typography>
                    </Box>
                    {!details.publiclyAvailable && onDelete && (
                        <IconButton
                            size="small"
                            color="error"
                            onClick={handleDelete}
                            sx={{ml: 1}}
                            aria-label="delete stock"
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>
                    )}
                </Box>
                <Box sx={{display: 'flex', mt: 2, justifyContent: 'space-between', alignItems: 'center'}}>
                    <Chip
                        icon={details.publiclyAvailable ? <PublicIcon/> : <PersonIcon/>}
                        label={details.publiclyAvailable ? "Public" : "Your upload"}
                        size="small"
                        color={details.publiclyAvailable ? "success" : "primary"}
                        variant="outlined"
                    />
                    <Chip
                        label={details.currencyType}
                        size="small"
                        variant="outlined"
                    />
                </Box>
            </CardContent>
        </Card>
    );
}
