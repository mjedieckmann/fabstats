import {Grid} from "@mui/material";
import {useCurrentPage} from "../../../utils/_globalState";
import {useState} from "react";

export default function About(){
    useCurrentPage('About');
    const [blub, setBlub] = useState('');

    return (
        <Grid item xs={12}>
            <h2>About</h2>
            {blub}
        </Grid>
    );
}