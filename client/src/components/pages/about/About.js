import {Divider, Grid, Link, Paper} from "@mui/material";
import {contactDialogState, useCurrentPage} from "../../../utils/_globalState";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {useRecoilState} from "recoil";

export default function About(){
    const [ ,setContactDialogOpen ] = useRecoilState(contactDialogState);
    useCurrentPage('About');

    return (
        <Grid container spacing={3}>
            <Grid item xs={1}/>
            <Grid item xs={10} textAlign={"center"}>
                <Paper sx={{py: 1}}>
                <Typography variant="h4" fontWeight={"bold"} gutterBottom component="div">
                    Flesh and Blood™ TCG Unofficial Statistics
                </Typography>
                </Paper>
            </Grid>
            <Grid item xs={1}/>
            <Grid item xs={1}/>
            <Grid item xs={5} sx={{textAlign:"center", mx: "auto"}}>
                <Paper sx={{py: 3}}>
                    <Box sx={{mx: 3, my: 2}}>
                        <Stack spacing={1}>
                            <Typography variant="h5" fontWeight={"bold"} gutterBottom component="div">
                                What is this website?
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                This website is a tool to log match data from <a target="_blank" rel="noreferrer"  href={"https://fabtcg.com"}>Flesh & Blood™</a> games.
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                You can find data about scores, events, specific heroes, and more!
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Create and account to log your matches and connect to your team!
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Ultimately, the purpose of all this is to get objective and reliable data that can be used to analyze matchups, meta games, and differences between casual and competitive play. If you want to know more about the game itself or are looking for complementary resources, see the links below.
                            </Typography>
                        </Stack>
                        <Divider sx={{mt: 2}}><Typography variant="body2">USEFUL RESOURCES</Typography></Divider>
                        <Stack sx={{mt: 2}}>
                            <Typography variant="overline" gutterBottom>
                                Official Website - <a target="_blank" rel="noreferrer"  href={"https://fabtcg.com"}>fabtcg.com</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Deck builder, collection manager and more - <a target="_blank" rel="noreferrer"  href={"https://fabdb.net"}>fabdb.net</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Articles, videos, strategy content and more - <a target="_blank" rel="noreferrer"  href={"https://rathetimes.com"}>rathetimes.com</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Play against an AI - <a target="_blank" rel="noreferrer"  href={"https://www.felttable.com/fab"}>felttable.com</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Play online - <a target="_blank" rel="noreferrer"  href={"https://www.fleshandbloodonline.com/FaBOnline/MainMenu.php"}>fleshandbloodonline.com</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Connect with the community - <a target="_blank" rel="noreferrer"  href={"https://discord.gg/wyHm79QvpR"}>discord</a>
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={5} sx={{textAlign:"center", mx: "auto" }}>
                <Paper sx={{py: 3}}>
                    <Box sx={{mx: 3, my: 2}}>
                        <Stack spacing={1}>
                            <Typography variant="h5" fontWeight={"bold"} gutterBottom component="div">
                                About the project
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                I started this project as a way to teach myself modern full-stack technologies.
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                I pushed to create and deploy a minimal version of the website as soon as possible. For this reason, the current website is very basic, especially in terms of it's visual design.
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                A list of the improvements that I am planning to implement can be found <a href={"https://docs.google.com/spreadsheets/d/1exop_D--T8YInfSe7mOj4aa1bxL14hmeg0r62cEDwwk/edit?usp=sharing"} target="_blank" rel="noreferrer">here</a>.
                                If you find bugs, want to give feedback, or want to contribute, please get in <Link component="button" variant="body2" onClick={() => {setContactDialogOpen(true)}}>contact</Link> with me!
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                The source code is licenced under the <a href={"https://www.gnu.org/licenses/gpl-3.0.en.html"} target="_blank" rel="noreferrer">GNU General Public Licence (GPLv3)</a> and available on <a href={"https://github.com/mjedieckmann/fabstats"} target="_blank" rel="noreferrer">Github</a>!
                            </Typography>
                        </Stack>
                        <Divider sx={{mt: 2}}><Typography variant="body2">TECH STACK</Typography></Divider>
                        <Stack sx={{mt: 2}}>
                            <Typography variant="overline" gutterBottom>
                                Runtime - <a target="_blank" rel="noreferrer" href={"https://nodejs.org/en/"}>Node</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Backend - <a target="_blank" rel="noreferrer" href={"https://expressjs.com"}>Express</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Database - <a target="_blank" rel="noreferrer" href={"https://www.mongodb.com"}>MongoDB</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Frontend - <a target="_blank" rel="noreferrer" href={"https://reactjs.org"}>React</a>
                            </Typography>
                            <Typography variant="overline" gutterBottom>
                                Hosted on - <a target="_blank" rel="noreferrer" href={"https://www.digitalocean.com"}>DigitalOcean</a>
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={1}/>
        </Grid>
    );
}