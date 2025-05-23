import { ExpandMore } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ReactNode } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";

interface TopLevelListItemProps {
    icon: ReactNode;
    text: string;
    onClick: () => void;
    expandable?: boolean;
    expanded?: boolean;
}

export function TopLevelListItem({ icon, text, onClick, expandable, expanded }: Readonly<TopLevelListItemProps>) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                    primary={text}
                    slotProps={{
                        primary: {
                            fontSize: '1.2rem',
                            fontWeight: '550',
                        },
                    }}
                />
                {expandable && (expanded ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
        </ListItem>
    );
}