import {Box, Container, Divider, IconButton, Typography} from "@mui/material";
import {TooltipHtml} from "../../util/TooltipHtml.tsx";
import InfoIcon from "@mui/icons-material/Info";

export function DefaultInfo() {
    return (
        <Container maxWidth="md">
            <Box sx={{textAlign: 'center', mt: 4}}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Info Pages
                </Typography>
                <Divider sx={{borderColor: 'primary.main'}}/>

                <Typography variant="subtitle1" sx={{mt: 2, color: 'text.secondary'}}>
                    Please select a category from the menu to learn more.
                </Typography>
                <Typography variant="body1" sx={{mt: 2}}>
                    These pages provide detailed explanations and examples to help you understand different trading
                    strategies and concepts.
                    Use the navigation menu to explore topics like Moving Average Crossovers or Breakouts.
                </Typography>
                <Typography variant="h6" gutterBottom sx={{mt: 4}}>
                    Tooltips
                    <TooltipHtml
                        title="Learn More About Tooltips"
                        info="Tooltips provide additional information about specific terms and concepts throughout the app."
                        link="/infopages"
                    >
                        <IconButton sx={{marginRight: 1, color: 'rgba(0, 0, 0, 0.3)'}}>
                            <InfoIcon sx={{fontSize: '1.4rem'}}/>
                        </IconButton>
                    </TooltipHtml>
                </Typography>
                <Typography variant="body1" sx={{mt: 2}}>
                    Throughout the app, you will find tooltips that provide additional information about
                    specific terms and concepts. Some of these have a title (like the example above)
                    which you can click through on to go to the relevant info page for more details.
                </Typography>
            </Box>
        </Container>
    );
}