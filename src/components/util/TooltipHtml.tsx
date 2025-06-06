import {ReactElement} from "react";
import {Link, Tooltip, Typography} from '@mui/material';

interface TooltipHtmlProps {
    title?: string;
    info: string;
    link?: string;
    children: ReactElement;
}

export function TooltipHtml({title, info, link, children}: Readonly<TooltipHtmlProps>) {
    return (
        <Tooltip
            title={
                <div>
                    {link ? (
                        <Link href={link} target="_blank" rel="noopener"
                              sx={{fontSize: '0.8rem', fontWeight: 'bold', color: 'inherit'}}>
                            {title}
                        </Link>
                    ) : (
                        <Typography variant="subtitle2" sx={{fontSize: '0.8rem', fontWeight: 'bold'}}>
                            {title}
                        </Typography>
                    )}
                    <Typography
                        variant="body2"
                        sx={{fontSize: '0.75rem'}}
                        dangerouslySetInnerHTML={{__html: info}}
                    />
                </div>
            }
            arrow
        >
            {children}
        </Tooltip>
    );
}