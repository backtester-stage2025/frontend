import {Box} from "@mui/material";
import {Outlet} from "react-router-dom";

const HEADER_HEIGHT = 8;

export function RouteLayout() {
    return (
        <Box sx={{ mt: HEADER_HEIGHT }}>
            <Outlet />
        </Box>
    );
}