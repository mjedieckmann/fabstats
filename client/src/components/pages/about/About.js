import {Divider, Grid, Link, Paper} from "@mui/material";
import {useCurrentPage} from "../../../utils/_globalState";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

export default function About(){
    useCurrentPage('About');

    return (
        <Grid container spacing={3}>
            <Grid item xs={1}/>
            <Grid item xs={10} textAlign={"center"}>
                <Paper sx={{py: 1}}>
                <Typography variant="h3" gutterBottom component="div">
                    Flesh and Blood Scoreboard (unofficial)
                </Typography>
                </Paper>
            </Grid>
            <Grid item xs={1}/>
            <Grid item xs={1}/>
            <Grid item xs={5} sx={{textAlign:"center", mx: "auto" }}>
                <Paper sx={{py: 4}}>
                    <Box sx={{m: 4}} >
                        <Typography variant="h4" gutterBottom component="div">
                            What is this website for?
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                            quasi quidem quibusdam.
                        </Typography>
                        <Divider sx={{mt: 2}}><Typography variant="body2">USEFUL RESOURCES</Typography></Divider>
                        <Stack spacing={1} sx={{mt: 2}}>
                            <Link href="#" variant="body2" underline={"hover"}>
                                {'variant="body2"'}
                            </Link>
                            <Link href="#" variant="body2" underline={"hover"}>
                                {'variant="body2"'}
                            </Link>
                            <Link href="#" variant="body2" underline={"hover"}>
                                {'variant="body2"'}
                            </Link>
                        </Stack>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={5} sx={{textAlign:"center", mx: "auto" }}>
                <Paper sx={{py: 4}}>
                    <Box sx={{m: 4}} >
                        <Typography variant="h4" gutterBottom component="div">
                            Why did I create this website?
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
                            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
                            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
                            quasi quidem quibusdam.
                        </Typography>
                        <Divider sx={{mt: 2}}><Typography variant="body2">TECH STACK</Typography></Divider>
                        <Stack spacing={1} sx={{mt: 2}}>
                            <Link href="#" variant="body2" underline={"hover"}>
                                {'variant="body2"'}
                            </Link>
                            <Link href="#" variant="body2" underline={"hover"}>
                                {'variant="body2"'}
                            </Link>
                            <Link href="#" variant="body2" underline={"hover"}>
                                {'variant="body2"'}
                            </Link>
                        </Stack>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={1}/>
        </Grid>
    );
}