import CloseIcon from "@mui/icons-material/Close";
import {Button} from "@mui/material";

interface CloseButtonProps {
    onClose: () => void;
    color?: string;
}

export function CloseButton({onClose, color}: Readonly<CloseButtonProps>) {
    return (
        <Button
            onClick={onClose}
            sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 'auto',
                ...(color && {color: color}),
            }}
        >
            <CloseIcon />
        </Button>
    )
}