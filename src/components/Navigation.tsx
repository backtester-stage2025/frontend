import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import ListIcon from '@mui/icons-material/List';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {Link} from 'react-router-dom'

interface NavigationProps {
    isOpen: boolean
    onClose: () => void
}

export function Navigation({isOpen, onClose}: Readonly<NavigationProps>) {
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <List sx={{width: 200}}>
                {[
                    { label: 'Stock List', link: '/list', icon: <ListIcon/> },
                    { label: 'Buy and Hold', link: '/buy-and-hold', icon: <ShowChartIcon/> },
                ].map((menuItem) => (
                    <ListItem disableGutters key={menuItem.link}>
                        <ListItemButton component={Link} to={menuItem.link} onClick={onClose}>
                            <ListItemIcon>{menuItem.icon}</ListItemIcon>
                            <ListItemText primary={menuItem.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}
