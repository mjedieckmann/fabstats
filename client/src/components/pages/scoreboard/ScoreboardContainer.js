/**
 * Entry point container for the scoreboard page.
 * Initially loads matches from the database and makes sure that the filter is applied to them.
 */
import {useEffect, useState} from "react";
import {atom, useRecoilState} from "recoil";
import {Box, Stack, Paper} from "@mui/material";
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
    const [ ,setMatches ] = useRecoilState(matchesState);
    const [ dirty, ] = useRecoilState(dirtyState);
    useEffect(() => {
        axios.get('/api/matches')
            .then(res => {
                setMatches(res.data);
            });
    }, [dirty, setMatches]);

    const [filteredMatches,] = useRecoilState(filteredMatchesState);
    const [ heroes, setHeroes ] = useState([]);
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                setHeroes(res.data);
            });
    }, []);

    return (
        <Stack spacing={1}>
            <Paper variant={"opacity-0.9"} sx={{p: 1, mx: 3}}>
                <ScoreboardFilter/>
            </Paper>
            <Stack direction={"row"} spacing={2} height={"60vH"} paddingX={3}>
                <Paper variant={"opacity-0.9"} sx={{width: 0.5}}>
                    <SummaryChart matches={filteredMatches} heroes={heroes}/>
                </Paper>
                <Stack width={0.5}>
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
            </Stack>
        </Stack>
    )
}
