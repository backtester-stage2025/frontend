import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { ReactNode } from "react";

interface TopLevelListItemProps {
    icon: ReactNode;
    text: string;
    onNavigate: () => void;
    onToggleDropdown?: () => void;
    expandable?: boolean;
    expanded?: boolean;
}

export function TopLevelListItem({
                                     icon,
                                     text,
                                     onNavigate,
                                     onToggleDropdown,
                                     expandable,
                                     expanded,
                                 }: Readonly<TopLevelListItemProps>) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onNavigate}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                    primary={text}
                    slotProps={{
                        primary: {
                            fontSize: "1.2rem",
                            fontWeight: "550",
                        },
                    }}
                />
            </ListItemButton>
            {expandable && (
                <IconButton onClick={onToggleDropdown}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            )}
        </ListItem>
    );
}