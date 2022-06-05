/**
 * Entry point container for the scoreboard page.
 * Initially loads matches from the database and makes sure that the filter is applied to them.
 */
import {useEffect} from "react";
import {atom, useRecoilState} from "recoil";
import {Grid, Box} from "@mui/material";
import {dirtyState, useCurrentPage} from "../../../utils/_globalState";
import Scoreboard from "./Scoreboard";
import {ScoreboardFilter} from "./ScoreboardFilter";
import MatchDetailDialog from "./match/MatchDetailDialog";

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
        fetch('/api/matches')
            .then(response => response.json())
            .then(data => {
                setMatches(data);
            });
    }, [dirty, setMatches]);

    const [, setFilteredMatches] = useRecoilState(filteredMatchesState);
    useEffect(() => {
        setFilteredMatches(matches);
    }, [matches, setFilteredMatches]);

    return (
            <Grid container spacing={2}>
                <Grid item xs={1}/>
                <Grid item xs={3} >
                    <ScoreboardFilter/>
                </Grid>
                <Grid item xs={7}>
                    <Scoreboard/>
                    <Box
                        display="flex"
                        marginY={2}
                        alignItems="center"
                        justifyContent="right"
                    >
                        <MatchDetailDialog matchDialogMode={'create'}/>
                    </Box>
                </Grid>
                <Grid item xs={1}/>
            </Grid>
    )
}
