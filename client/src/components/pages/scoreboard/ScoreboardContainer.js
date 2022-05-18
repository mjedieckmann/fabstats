import {Fab, Grid} from "@mui/material";
import {useCurrentPage} from "../../../utils/_globalState";
import Scoreboard from "./Scoreboard";
import {ScoreboardFilter} from "./ScoreboardFilter";
import {useEffect} from "react";
import {atom, useRecoilState} from "recoil";
import Paper from "@mui/material/Paper";
import {styled} from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import AuthenticationDialog from "../../user/AuthenticationDialog";
import MatchDialog from "./MatchDialog";

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

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
            <Grid container spacing={2}>
                <Grid item xs={3} >
                    <ScoreboardFilter/>
                </Grid>
                <Grid item xs={8}>
                    <Scoreboard/>
                    <Box
                        display="flex"
                        marginY={2}
                        alignItems="center"
                        justifyContent="right"
                    >
                        <MatchDialog/>
                    </Box>
                </Grid>
            </Grid>
    )
}
