import {Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import BoardsIcon from '@mui/icons-material/Dashboard'
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
                    {label: 'Stock List', link: '/list', icon: <BoardsIcon/>}
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
