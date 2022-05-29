import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {Grid, Paper, ToggleButton} from "@mui/material";

import NavbarIcon from "./NavbarIcon";
import {useRecoilState} from "recoil";
import {nav_buttons} from "../pages/_pageUtils";
import {currentPageState} from "../../utils/_globalState";
import DialogContainer from "../user/DialogContainer";
import Stack from "@mui/material/Stack";

export default function Navbar() {
    const [currentPage, ] = useRecoilState(currentPageState);

    return (
        <Paper>
            <AppBar position="static" color={"transparent"}>
                <Toolbar>
                    <Grid container alignItems={"center"}>
                        <Grid item xs={3} textAlign={"center"}>
                            <NavbarIcon/>

                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={2} direction={"row"} justifyContent={"center"}>
                                {nav_buttons.map( (button) => (
                                    <ToggleButton selected={button.name === currentPage} key={button.name} value={button.name} href={button.url} size={"small"}>{button.name}</ToggleButton>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={3} textAlign={"center"}>
                            <DialogContainer/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Paper>
    );
}
