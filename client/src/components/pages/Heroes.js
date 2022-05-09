import {Grid} from "@mui/material";
import {useCurrentPage} from "./_pageUtils";

export default function Heroes(){
    useCurrentPage('Heroes');
    return (
        <Grid item xs={12}>
            <h2>Heroes</h2>
            <>TODO: Implement hero page</>
        </Grid>
    );
}