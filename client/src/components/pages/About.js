import {Grid} from "@mui/material";
import {useCurrentPage} from "./_pageUtils";
import {createContext, useReducer, useState} from "react";
import {DispatchTester} from "./DispatchTester";

export const AboutDispatch = createContext(null);

export default function About(){
    useCurrentPage('About');
    const [blub, setBlub] = useState('');

    return (
        <Grid item xs={12}>
            <h2>About</h2>
            {blub}
            <AboutDispatch.Provider value={[blub, setBlub]}>
                <DispatchTester>

                </DispatchTester>
            </AboutDispatch.Provider>
        </Grid>
    );
}