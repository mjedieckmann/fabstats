import {Grid} from "@mui/material";
import {useCurrentPage} from "./_pageUtils";

export default function Scoreboard(){
    useCurrentPage('Scoreboard');
    return (
        <Grid item xs={12}>
            <h2>Scoreboard</h2>
            <>TODO: Implement scoreboard page</>
        </Grid>
    );
}