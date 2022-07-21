/**
 * Navbar that is displayed at the top of all pages.
 */

import {useRecoilState} from "recoil";
import {Grid, Paper, ToggleButton, Stack, Toolbar, AppBar} from "@mui/material";
import NavbarIcon from "./NavbarIcon";
import {currentPageState} from "../../utils/_globalState";
import UserDialogContainer from "./user/UserDialogContainer";
import {nav_buttons} from "./_navbarUtils";
import {Link} from "react-router-dom";

export default function Navbar() {
    const [currentPage, ] = useRecoilState(currentPageState);

    return (
        <Paper variant={"opacity-0.8"}>
            <AppBar position="static" color={"transparent"}>
                <Toolbar>
                    <Grid container alignItems={"center"}>
                        <Grid item xs={3} textAlign={"center"}>
                            <NavbarIcon/>

                        </Grid>
                        <Grid item xs={6}>
                            <Stack spacing={2} direction={"row"} justifyContent={"center"}>
                                {nav_buttons.map( (button) => (
                                    <Link key={button.name} to={button.url} style={{textDecoration: "none"}}><ToggleButton selected={button.name === currentPage} value={button.name} size={"small"}>{button.name}</ToggleButton></Link>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={3} textAlign={"center"}>
                            <UserDialogContainer/>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Paper>
    );
}
