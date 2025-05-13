import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {useNavigate} from "react-router-dom";
import {Login} from "./Login";

type HeaderProps = {
    onOpenDrawer: () => void;
};

export function Header({onOpenDrawer}: Readonly<HeaderProps>) {
    const navigate = useNavigate();

    const handleAccountClick = () => {
        navigate("/account");
    };

    return (
        <AppBar position="static" color="transparent">
            <Toolbar sx={{justifyContent: "space-between"}}>
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <IconButton onClick={onOpenDrawer}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6">Stock Trading Strategy Backtester</Typography>
                </Box>
                <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                    <Login/>
                    <IconButton onClick={handleAccountClick} color="inherit">
                        <AccountCircle/>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}