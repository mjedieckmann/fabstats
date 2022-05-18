import {Grid} from "@mui/material";
import {useCurrentPage} from "../../../utils/_globalState";
import Scoreboard from "./Scoreboard";
import Scoreboard_ from "./Scoreboard_";
import {ScoreboardFilter} from "./ScoreboardFilter";
import {useEffect} from "react";
import {atom, useRecoilState} from "recoil";

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
    const [matches, setMatches] = useRecoilState(matchesState);
    useEffect(() => {
        fetch('/api/matches')
            .then(response => response.json())
            .then(data => {
                setMatches(data);
                console.log(data);
            });
    }, []);

    const [, setFilteredMatches] = useRecoilState(filteredMatchesState);
    useEffect(() => {
        setFilteredMatches(matches);
    }, [matches]);

    return (
        <>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={8}>
                <h2>Scoreboard</h2>
                <ScoreboardFilter/>
                <Scoreboard/>
            </Grid>
            <Grid item xs={2}>
            </Grid>
        </>
    );
}