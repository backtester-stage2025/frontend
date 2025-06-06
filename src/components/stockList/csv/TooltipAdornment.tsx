import {IconButton, InputAdornment} from "@mui/material";
import {TooltipHtml} from "../../util/TooltipHtml.tsx";
import InfoIcon from "@mui/icons-material/Info";

export function renderTooltipAdornment(title: string, description: string) {
    return (
        <InputAdornment position="end">
            <TooltipHtml title={title} info={description}>
                <IconButton sx={{marginRight: 1, color: 'rgba(0, 0, 0, 0.3)'}}>
                    <InfoIcon sx={{fontSize: '1.4rem'}}/>
                </IconButton>
            </TooltipHtml>
        </InputAdornment>
    );
}