import {useEffect, useState} from "react";
import {Autocomplete, Container, Grid} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useRecoilState} from "recoil";
import {filteredMatchesState, matchesState, pageState} from "./ScoreboardContainer";
import {eventsState, heroesState, useSimpleDataFetch} from "../_pageUtils";

export const ScoreboardFilter = () =>{
    const [heroes, setHeroes] = useRecoilState(heroesState);
    useSimpleDataFetch(setHeroes, 'api/heroes', 'name');

    const [formats, setFormats] = useState([]);
    useSimpleDataFetch(setFormats, 'api/formats', 'descriptor');

    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    useEffect(() => {
        fetch('/users')
            .then(res => res.json())
            .then(res => {
                let users = new Set();
                let teams = new Set();
                res.map((user) => {
                    users.add(user.nick);
                    if (user.team != null) {
                        teams.add(user.team.nick)
                    }
                })
                setUsers([...users]);
                setTeams([...teams]);
            })
    }, []);

    const [events, setEvents] = useRecoilState(eventsState);
    const [eventTypes, setEventTypes] = useState([]);
    const [tos, setTos] = useState([]);
    useEffect(() => {
        fetch('/api/events')
            .then(res => res.json())
            .then(res => {
                let events = new Set();
                let eventTypes = new Set();
                let tos = new Set();
                res.map((event) => {
                    events.add(event);
                    eventTypes.add(event.event_type);
                    if (event.to != null) {
                        tos.add(event.to.descriptor);
                    }
                })
                setEvents([...events]);
                setEventTypes([...eventTypes]);
                setTos([...tos]);
            })
    }, []);

    const [matches,] = useRecoilState(matchesState);
    const [,setPage] = useRecoilState(pageState);
    const [filteredMatches,setFilteredMatches] = useRecoilState(filteredMatchesState);
    const [filter, setFilter] = useState({hero: null, user: null, team: null, format: null, event: null, eventType: null, to: null, meta: null, round: null});

    const [rounds, setRounds] = useState([]);
    const [metas, setMetas] = useState([]);
    useEffect(() => {
        let rounds = new Set();
        let metas = new Set();
        filteredMatches.map( match => {
            rounds.add(match.round);
            metas.add(match.meta.descriptor);
        });
        setRounds([...rounds]);
        setMetas([...metas]);
    }, [filteredMatches]);

    useEffect(() => {
        setFilteredMatches(
            matches.filter((row) =>(
                (filter.hero === null || filter.hero === row.hero_winner.name || filter.hero === row.hero_loser.name) &&
                (filter.user === null || filter.user === row.user_winner.nick || filter.user === row.user_loser.nick) &&
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
                (filter.round === null || row.round === filter.round)
            )))
    },[filter]);

    return(
            <Grid container spacing={2}>
                <Grid item lg={6}>
                <Autocomplete
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
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, eventType: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="event-type-filter"
                        options={eventTypes}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Event Type" />}
                    />
                </Grid>
                <Grid item lg={6}>
                    <Autocomplete
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
                <Grid item lg={6}>
                    <Autocomplete
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
                        onChange={(event, newValue) => {
                            setPage(0);
                            setFilter({...filter, round: newValue});
                        }}
                        size={"small"}
                        disablePortal
                        id="round-filter"
                        options={rounds}
                        sx={{ width: 1 }}
                        renderInput={(params) => <TextField {...params} label="Round" />}
                    />
                </Grid>
            </Grid>
    )
}