/**
 * Entry point container for the scoreboard page.
 * Initially loads matches from the database and makes sure that the filter is applied to them.
 */
import {useEffect, useState} from "react";
import {atom, useRecoilState} from "recoil";
import {Grid, Box, Stack, Paper} from "@mui/material";
import {dirtyState, useCurrentPage} from "../../../utils/_globalState";
import Scoreboard from "./Scoreboard";
import {ScoreboardFilter} from "./ScoreboardFilter";
import MatchDetailDialog from "./match/MatchDetailDialog";
import axios from "axios";
import {SummaryChart} from "./SummaryChart";

export const matchesState = atom({
    key: 'matches',
    default: [],
});

export const filteredMatchesState = atom({
    key: 'filteredMatches',
    default: [],
});

export const pageState = atom({
    key: 'page',
    default: 0,
});

export default function ScoreboardContainer(){
    useCurrentPage('Scoreboard');
    const [ matches, setMatches ] = useRecoilState(matchesState);
    const [ dirty, ] = useRecoilState(dirtyState);
    useEffect(() => {
        axios.get('/api/matches')
            .then(res => {
                setMatches(res.data);
            });
    }, [dirty, setMatches]);

    const [filteredMatches, setFilteredMatches] = useRecoilState(filteredMatchesState);
    useEffect(() => {
        setFilteredMatches(matches);
    }, [matches, setFilteredMatches]);
    const [ heroes, setHeroes ] = useState([]);
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                setHeroes(res.data);
            });
    }, []);

    return (
            <Grid container spacing={2}>
                <Grid item xs={1}/>
                <Grid item xs={3} >
                    <ScoreboardFilter/>
                </Grid>
                <Grid item xs={7}>
                    <Stack>
                        <Paper variant={"opacity-0.9"}>
                            <SummaryChart matches={filteredMatches} heroes={heroes}/>
                        </Paper>
                        <Scoreboard/>
                        <Box
                            display="flex"
                            marginY={2}
                            alignItems="center"
                            justifyContent="right"
                        >
                            <MatchDetailDialog matchDialogMode={'create'}/>
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
    )
}
