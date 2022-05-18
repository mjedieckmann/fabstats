import {Grid} from "@mui/material";
import {useCurrentPage} from "../../../utils/_globalState";
import {createContext, useState} from "react";
import {UploadTester} from "../UploadTester";

export const AboutDispatch = createContext(null);

export default function About(){
    useCurrentPage('About');
    const [blub, setBlub] = useState('');

    return (
        <Grid item xs={12}>
            <h2>About</h2>
            {blub}
            <AboutDispatch.Provider value={[blub, setBlub]}>
                <UploadTester>

                </UploadTester>
            </AboutDispatch.Provider>
        </Grid>
    );
}