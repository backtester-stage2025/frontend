import {useNavigate} from "react-router-dom";
import {Card} from "@mui/material";
import {StockDetails} from "../../model/StockDetails.ts";

interface StockCardProps {
    details: StockDetails
}

export function StockCard({details}: Readonly<StockCardProps>) {
    const navigate = useNavigate();

    return (
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
            key={details.officialName}
            onClick={() => navigate(`/stock-overview?stockName=${details.officialName}`)}
        >
            {details.companyName}
            {details.officialName}
        </Card>
    )
}
