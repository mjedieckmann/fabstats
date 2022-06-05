/**
 * Static footer that is displayed on every page.
 */

import {Grid, Paper, Typography} from "@mui/material";
import ContactDialog from "./ContactDialog";
import PrivacyPolicyDialog from "./PrivacyPolicyDialog";

export const Footer = () => {
    return(
        <Paper variant={"opacity-0.8"} sx={{bottom: 0}} elevation={3}>
            <Grid container>
                <Grid item xs={12} textAlign={"center"}>
                    <ContactDialog/>
                    <PrivacyPolicyDialog/>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Typography variant="caption" gutterBottom>
                        fabstats.info is a free online resource for the <a target="_blank" rel="noreferrer" href={"https://fabtcg.com"}>Flesh & Blood™</a> TCG by <a target="_blank" rel="noreferrer" href={"https://legendstory.com"}>Legend Story Studios®</a>.
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Typography variant="caption" gutterBottom>
                        fabstats.info is in no way affiliated with <a target="_blank" rel="noreferrer" href={"https://legendstory.com"}>Legend Story Studios®</a>.
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Typography variant="caption" gutterBottom>
                        All intellectual property (IP) belongs to <a target="_blank" rel="noreferrer" href={"https://legendstory.com"}>Legend Story Studios®</a>, <a target="_blank" rel="noreferrer" href={"https://fabtcg.com"}>Flesh & Blood™</a>, and set names are trademarks of <a target="_blank" rel="noreferrer" href={"https://legendstory.com"}>Legend Story Studios®</a>.
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Typography variant="caption" gutterBottom>
                        <a target="_blank" rel="noreferrer" href={"https://fabtcg.com"}>Flesh & Blood™</a> characters, cards, logos, and art are property of <a target="_blank" rel="noreferrer" href={"https://legendstory.com"}>Legend Story Studios®</a>.
                    </Typography>
                </Grid>
                <Grid item xs={12} textAlign={"center"}>
                    <Typography variant="caption" gutterBottom>
                        fabstats.info is not a digital gaming product.
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}