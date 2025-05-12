import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { Login } from "./Login";

type HeaderProps = {
    onOpenDrawer: () => void
}

export function Header({onOpenDrawer}: Readonly<HeaderProps>) {
    return (
        <AppBar position="static" color="transparent">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton onClick={onOpenDrawer}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Stock Trading Strategy Backtester</Typography>
                </Box>
                <Login />
            </Toolbar>
        </AppBar>
    )
}