import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
    Avatar, Box, Button,
    CardActionArea, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider, Grid, Stack, Tooltip
} from '@mui/material';
import {useEffect, useState} from "react";
import {BarChart} from "./BarChart";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export default function HeroCard(props) {
    const [ eventFilter, setEventFilter ] = useState(null);
    const [ metaFilter, setMetaFilter ] = useState(null);
    const [ filteredMatches, setFilteredMatches ] = useState([]);
    useEffect(() => {
        setFilteredMatches(props.matches.filter((match) =>
            (
                (props.hero._id === match.hero_winner._id) ||
                (props.hero._id === match.hero_loser._id)
            ) &&
            (
                (eventFilter === null || eventFilter?._id === match.event?._id) &&
                (metaFilter === null || metaFilter?._id === match.meta?._id)
            )
        ));
    }, [props.matches, eventFilter, metaFilter, props.hero._id])
    const [ wins, setWins ] = useState(0);
    const [ losses, setLosses ] = useState(0);
    useEffect(() => {
        setWins(filteredMatches.filter((match) => match.hero_winner.name === props.hero.name).length)
        setLosses(filteredMatches.filter((match) => match.hero_loser.name === props.hero.name).length)
    }, [filteredMatches, props.hero.name])
    const [ heroDialogOpen, setHeroDialogOpen ] = useState(false);

    const handleClose = () => {
        setMetaFilter(null);
        setEventFilter(null);
        setHeroDialogOpen(false);
    }

    const handleOpen = () => {
        setMetaFilter(props.metaFilter);
        setEventFilter(props.eventFilter);
        setHeroDialogOpen(true);
    }
    return (
        <>
            <Card>
                <CardActionArea onClick={handleOpen}>
                    <CardMedia
                        top={0}
                        component="img"
                        image={props.hero.img}
                        sx={{height: 200, objectPosition: "top"}}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="subtitle2" component="div" textAlign={"center"}>
                            {props.hero.name}
                        </Typography>
                        <Divider/>
                        <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} pt={1}>
                            {(wins + losses) !== 0 && (wins + losses) < 5
                                ? <Tooltip title={"Not much data!"}><WarningAmberIcon color={"warning"} sx={{ fontSize: 15 }} /></Tooltip>
                                : null
                            }
                            <Tooltip title={wins + " / " + (wins + losses)} arrow>
                                <Typography variant="subtitle1" color="text.secondary" textAlign={"center"}>

                                    {(wins + losses) === 0 ? "N/A" : Math.round((wins / (wins + losses)) * 100) + " %"}
                                </Typography>
                            </Tooltip>
                        </Stack>

                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog open={heroDialogOpen} onClose={handleClose} fullWidth={true} maxWidth={"lg"}>
                <DialogTitle>
                    <Box display={"flex"} alignItems={"center"}>
                        <Avatar alt={props.hero.name} src={props.hero.img} sx={{ width: 56, height: 56 }} />
                        <Typography textAlign={"center"} width={1} variant="h5">
                            {props.hero.name}
                        </Typography>
                    </Box>
                </DialogTitle>
                <Divider/>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={8} height={"70vH"}>
                            <BarChart matches={filteredMatches} hero={props.hero} heroes={props.heroes}/>
                        </Grid>
                        <Grid item xs={4}>
                            <Stack spacing={2} height={1} justifyContent={"center"}>
                                <Autocomplete
                                    id={"events-input"}
                                    options={props.events}
                                    name={"events"}
                                    onChange={(event, newValue) => {
                                        setEventFilter(newValue);
                                    }}
                                    getOptionLabel={(option) => {
                                        return option.descriptor;
                                    }}
                                    isOptionEqualToValue={(option, value) => {
                                        return option.id === value.id;
                                    }}
                                    value={eventFilter}
                                    renderInput={(params) => <TextField {...params} label={"Event"}/>}
                                />
                                <Autocomplete
                                    id={"metas-input"}
                                    options={props.metas}
                                    name={"metas"}
                                    onChange={(event, newValue) => {
                                        setMetaFilter(newValue);
                                    }}
                                    getOptionLabel={(option) => {
                                        return option.descriptor;
                                    }}
                                    isOptionEqualToValue={(option, value) => {
                                        return option.id === value.id;
                                    }}
                                    value={metaFilter}
                                    renderInput={(params) => <TextField {...params} label={"Meta"}/>}
                                />
                                <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} pt={1}>
                                    {(wins + losses) !== 0 && (wins + losses) < 5
                                        ? <Tooltip title={"Not much data!"}><WarningAmberIcon color={"warning"} fontSize={"medium"} /></Tooltip>
                                        : null
                                    }
                                    <Tooltip title={wins + " / " + (wins + losses)} arrow>
                                        <Typography variant="h3" color="text.secondary" textAlign={"center"}>

                                            {(wins + losses) === 0 ? "N/A" : Math.round((wins / (wins + losses)) * 100) + " %"}
                                        </Typography>
                                    </Tooltip>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
