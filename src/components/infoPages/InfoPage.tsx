import {
    Box,
    CssBaseline,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar,
    Typography
} from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const panelWidth = 240;

export function InfoPage() {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Paper
                elevation={3}
                sx={{
                    width: panelWidth,
                    height: '80vh',
                    position: 'fixed',
                    top: '10vh',
                    left: '1vw',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    borderRadius: 2
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Paper>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: `${panelWidth + 20}px`
                }}
            >
                <Toolbar />
                <Typography sx={{ marginBottom: 2 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua...
                </Typography>
            </Box>
        </Box>
    );
}