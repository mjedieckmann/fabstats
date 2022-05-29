import {useEffect, useState} from "react";
import {Autocomplete, Grid, Paper} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useRecoilState} from "recoil";
import {filteredMatchesState, matchesState, pageState} from "./ScoreboardContainer";
import {eventsState, heroesState, useSimpleDataFetch} from "../_pageUtils";
import {dirtyState, EVENT_TYPES, ROUNDS} from "../../../utils/_globalState";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DesktopDatePicker, LocalizationProvider} from "@mui/lab";
import axios from "axios";

const NO_FILTER = {hero: null, user: null, team: null, format: null, event: null, eventType: null, to: null, meta: null, round: null, date_after: null, date_before: null};

export const ScoreboardFilter = () =>{
    const [heroes, setHeroes] = useRecoilState(heroesState);
    useSimpleDataFetch(setHeroes, 'api/heroes', 'name');

    const [formats, setFormats] = useState([]);
    useSimpleDataFetch(setFormats, 'api/formats', 'descriptor');

    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    useEffect(() =>{
        axios.get('/users')
            .then(res => {
                let users = new Set();
                res.data.forEach(user => {
                    users.add(user.nick);
                })
                setUsers([...users]);
            });
    }, []);
    useEffect(() =>{
        axios.get('/users/teams')
            .then(res => {
                let teams = new Set();
                res.data.forEach(team => {
                    teams.add(team.nick);
                })
                setTeams([...teams]);
            });
    }, []);

    const [events, setEvents] = useRecoilState(eventsState);
    const [ dirty, ] = useRecoilState(dirtyState);
    const [tos, setTos] = useState([]);
    useEffect(() =>{
        axios.get('/api/events')
            .then(res => {
                let events = new Set();
                res.data.forEach(event => {
                    events.add(event);
                })
                setEvents([...events]);
            });
    }, []);
    useEffect(() =>{
        axios.get('/api/tos')
            .then(res => {
                let tos = new Set();
                res.data.forEach(to => {
                    tos.add(to.descriptor);
                })
                setTos([...tos]);
            });
    }, []);

    const [matches,] = useRecoilState(matchesState);
    const [,setPage] = useRecoilState(pageState);
    const [,setFilteredMatches] = useRecoilState(filteredMatchesState);
    const [filter, setFilter] = useState(NO_FILTER);
    useEffect(() => {
        setFilter(NO_FILTER);
    }, [dirty])

    const [metas, setMetas] = useState([]);
    useEffect(() =>{
        axios.get('/api/metas')
            .then(res => {
                let metas = new Set();
                res.data.forEach(meta => {
                    metas.add(meta.descriptor);
                })
                setMetas([...metas]);
            });
    }, []);

    useEffect(() => {
        setFilteredMatches(
            matches.filter((row) =>(
                (filter.hero === null || filter.hero === row.hero_winner.name || filter.hero === row.hero_loser.name) &&
                (filter.user === null || (row.user_winner != null && row.user_winner.nick === filter.user) || (row.user_loser != null && row.user_loser.nick === filter.user)) &&
                (
                    filter.team === null ||
                    (
                        row.user_winner !== null &&
                        row.user_winner.team !== null &&
                        filter.team === row.user_winner.team.nick
                    ) ||
                    (
                        row.user_loser != null &&
                        row.user_loser.team != null &&
                        filter.team === row.user_loser.team.nick
                    )
                ) &&
                (filter.format === null || row.format.descriptor === filter.format) &&
                (filter.event === null || (row.event != null && row.event.descriptor === filter.event)) &&
                (filter.eventType === null || (row.event != null && row.event.event_type === filter.eventType)) &&
                (filter.to === null || (row.event != null && row.event.to !== null && row.event.to.descriptor === filter.to)) &&
                (filter.meta === null || row.meta.descriptor === filter.meta) &&
                (filter.round === null || row.round === filter.round) &&
                (filter.date_after === null || new Date(row.date).setHours(0,0,0,0) >= new Date(filter.date_after).setHours(0,0,0,0)) &&
                (filter.date_before === null || new Date(row.date).setHours(0,0,0,0) <= new Date(filter.date_before).setHours(0,0,0,0))
            )))
    },[filter, matches, setFilteredMatches]);

    return(
        <Paper>
            <Grid container spacing={2}>
                <Grid item lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Match date (after)"
                            value={filter.date_after}
                            minDate={new Date('2017-01-01')}
                            onChange={(newValue) => {
                                setFilter({...filter, date_after: newValue});
                            }}
                            renderInput={(params) => <TextField size={"small"} {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item lg={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label="Match date (before)"
                            value={filter.date_before}
                            minDate={new Date('2017-01-01')}
                            onChange={(newValue) => {
                                setFilter({...filter, date_before: newValue});
                            }}
                            renderInput={(params) => <TextField size={"small"} {...params} />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, hero: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="hero-filter"
                        options={heroes}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Hero" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, meta: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="meta-filter"
                        options={metas}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Meta" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, user: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="user-filter"
                        options={users}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="User" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, team: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="team-filter"
                        options={teams}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Team" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, event: newValue !== null ? newValue.descriptor : null});
                        }}
                        size={"small"}
                        disablePortal
                        id="event-filter"
                        options={events}
                        getOptionLabel={(option) => {
                            return option.descriptor;
                        }}
                        renderOption={(props, option) => <li {...props}>{option.descriptor}</li>}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Event" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, eventType: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="event-type-filter"
                        options={EVENT_TYPES}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Event Type" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, round: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="round-filter"
                        options={ROUNDS}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Round" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, format: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="format-filter"
                        options={formats}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Format" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
                        key={dirty}
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, to: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="to-filter"
                        options={tos}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="TO" />}
                    />
                </Grid>
            </Grid>
        </Paper>
    )
}