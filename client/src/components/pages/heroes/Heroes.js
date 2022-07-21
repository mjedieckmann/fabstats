/**
 * Under construction, come back later!
 */
import {Divider, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, Stack} from "@mui/material";
import {dirtyState, useCurrentPage} from "../../../utils/_globalState";
import {useEffect, useState} from "react";
import axios from "axios";
import HeroCard from "./HeroCard";
import {useRecoilState} from "recoil";
import {matchesState} from "../scoreboard/ScoreboardContainer";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Heroes(){
    useCurrentPage('Heroes');
    const [ heroes, setHeroes ] = useState([]);
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                setHeroes(res.data);
            });
    }, []);
    const [ events, setEvents ] = useState([]);
    const [ eventFilter, setEventFilter ] = useState(null);
    useEffect(() => {
        axios.get('/api/events')
            .then(res => {
                setEvents(res.data);
            });
    }, []);
    const [ matches, setMatches ] = useRecoilState(matchesState);
    const [ dirty, ] = useRecoilState(dirtyState);
    useEffect(() => {
        axios.get('/api/matches')
            .then(res => {
                setMatches(res.data);
            });
    }, [dirty, setMatches]);
    const [ metas, setMetas] = useState([]);
    const [ metaFilter, setMetaFilter ] = useState(null);
    useEffect(() => {
        axios.get('/api/metas')
            .then(res => {
                setMetas(res.data);
            });
    }, []);

    const [formatFilter, setFormatFilter] = useState('Classic Constructed');
    const handleChange = (event) => {
        setFormatFilter(event.target.value);
    };

    return (
        <Grid container spacing={2} paddingBottom={2} paddingX={2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={3} textAlign={"center"}>
                    <Paper>
                        <FormControl>
                            <FormLabel id="format-radio-label">Format</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="format-radio-label"
                                name="format-radio-buttons"
                                value={formatFilter}
                                onChange={handleChange}
                            >
                                <FormControlLabel labelPlacement={"top"} value="Classic Constructed" control={<Radio />} label="CC" />
                                <FormControlLabel labelPlacement={"top"} value="Blitz" control={<Radio />} label="Blitz" />
                                <FormControlLabel labelPlacement={"top"} value="both" control={<Radio />} label="Both" />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
            </Grid>
            <Grid item xs={3} display={"flex"}>
                <Paper sx={{width: 1, display: "flex", alignItems: "center", px: 2}}>

                    <Stack width={1} direction={"row"} divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                        <Autocomplete
                            fullWidth={true}
                            id={"events-input"}
                            options={events}
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
                            fullWidth={true}

                            id={"metas-input"}
                            options={metas}
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
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={3}></Grid>
            {heroes.filter((hero) => formatFilter === "both" || hero.formats.filter((format) => format.descriptor === formatFilter).length !== 0).map((hero) => (
                <Grid key={hero._id} item xs={2}>
                    <HeroCard hero={hero} matches={matches.filter((match) =>
                        (eventFilter === null || (match.event?._id === eventFilter?._id)) &&
                        (metaFilter === null || (match.meta?._id === metaFilter?._id))
                    )} events={events} metas={metas} eventFilter={eventFilter} metaFilter={metaFilter}/>
                </Grid>
            ))}
        </Grid>
    );
}