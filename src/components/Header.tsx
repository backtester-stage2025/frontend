import {AppBar, IconButton, Toolbar, Typography} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

type HeaderProps = {
    onOpenDrawer: () => void
}

export function Header({onOpenDrawer}: Readonly<HeaderProps>) {
    return (
        <AppBar position="static" color="transparent">
            <Toolbar sx={{justifyContent: 'flex-start'}}>
                <IconButton onClick={onOpenDrawer}>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6">Stock Trading Strategy Backtester</Typography>
            </Toolbar>
        </AppBar>
    )
}