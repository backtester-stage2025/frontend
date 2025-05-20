import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import ListIcon from '@mui/icons-material/List';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {Link} from 'react-router-dom'
import {useAuth} from "../context/AuthContext.tsx";

interface NavigationProps {
    isOpen: boolean
    onClose: () => void
}

export function Navigation({isOpen, onClose}: Readonly<NavigationProps>) {
    const {isAuthenticated} = useAuth();

    const menuItems = [
        {label: 'Stock List', link: '/stock-list', icon: <ListIcon/>, requiresAuth: false},
        {label: 'Strategy Tester', link: '/strategy-tester', icon: <ShowChartIcon/>, requiresAuth: true},
    ]

    const filteredMenuItems = menuItems
        .filter(item => !item.requiresAuth || isAuthenticated);

    return (
        <Drawer open={isOpen} onClose={onClose}>
            <List sx={{width: 200}}>
                {filteredMenuItems.map((menuItem) => (
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
