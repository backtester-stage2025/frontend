import {AppBar, Avatar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router-dom";
import {Login} from "./Login";
import {useAuth} from "../context/AuthContext.tsx";
import PersonIcon from "@mui/icons-material/Person";

type HeaderProps = {
    onOpenDrawer: () => void;
};

export function Header({onOpenDrawer}: Readonly<HeaderProps>) {
    const navigate = useNavigate();
    const {picture} = useAuth();

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
                    <IconButton onClick={handleAccountClick} color="inherit" sx={{padding: '4px'}}>
                        <Avatar
                            src={picture}
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                boxShadow: 3
                            }}
                        >
                            {!picture && <PersonIcon sx={{fontSize: 24}}/>}
                        </Avatar>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}