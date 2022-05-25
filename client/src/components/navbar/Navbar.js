import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {Grid, ToggleButton} from "@mui/material";

import NavbarIcon from "./NavbarIcon";
import {useRecoilState} from "recoil";
import {nav_buttons} from "../pages/_pageUtils";
import {currentPageState, currentUserState} from "../../utils/_globalState";
import ProfileDialog from "../user/ProfileDialog";
import DialogContainer from "../user/DialogContainer";

export default function Navbar() {
    const [currentPage, ] = useRecoilState(currentPageState);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color={"transparent"}>
                <Toolbar>
                    <NavbarIcon/>
                    <Grid container={true} justifyContent={"center"} columnGap={2}>
                        {nav_buttons.map( (button) => (
                            <ToggleButton selected={button.name === currentPage} key={button.name} value={button.name} href={button.url} size={"small"}>{button.name}</ToggleButton>
                        ))}
                    </Grid>
                    <DialogContainer/>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
