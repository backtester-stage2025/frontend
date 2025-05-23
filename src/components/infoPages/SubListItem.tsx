import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ReactNode } from "react";

interface SubListItemProps {
    icon: ReactNode;
    text: string;
    onClick: () => void;
}

export function SubListItem({ icon, text, onClick }: Readonly<SubListItemProps>) {
    return (
        <ListItem disablePadding>
            <ListItemButton sx={{ alignItems: 'center' }} onClick={onClick}>
                <ListItemIcon sx={{ minWidth: '24px' }}>{icon}</ListItemIcon>
                <ListItemText
                    primary={text}
                    slotProps={{
                        primary: {
                            fontSize: '1rem',
                        },
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
}