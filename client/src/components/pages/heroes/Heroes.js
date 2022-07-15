/**
 * Under construction, come back later!
 */
import {FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup} from "@mui/material";
import {dirtyState, useCurrentPage} from "../../../utils/_globalState";
import {useEffect, useState} from "react";
import axios from "axios";
import HeroCard from "./HeroCard";
import {useRecoilState} from "recoil";
import {matchesState} from "../scoreboard/ScoreboardContainer";

export default function Heroes(){
    useCurrentPage('Heroes');
    const [ heroes, setHeroes ] = useState([]);
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                setHeroes(res.data);
                console.log(res.data)
            });
    }, []);
    const [ matches, setMatches ] = useRecoilState(matchesState);
    const [ dirty, ] = useRecoilState(dirtyState);
    useEffect(() => {
        fetch('/api/matches')
            .then(response => response.json())
            .then(data => {
                setMatches(data);
            });
    }, [dirty, setMatches]);
    const [value, setValue] = useState('female');
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <Grid container spacing={2} paddingBottom={2} paddingX={2}>
            <Grid item xs={5}></Grid>
            <Grid item xs={2} textAlign={"center"}>
                <Paper>
                    <FormControl>
                        <FormLabel id="format-radio-label">Format</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="format-radio-label"
                            name="format-radio-buttons"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel labelPlacement={"top"} value="Classic Constructed" control={<Radio />} label="CC" />
                            <FormControlLabel labelPlacement={"top"} value="Blitz" control={<Radio />} label="Blitz" />
                            <FormControlLabel labelPlacement={"top"} value="both" control={<Radio />} label="Both" />
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </Grid>
            <Grid item xs={5}></Grid>
            {heroes.filter((hero) => value === "both" || hero.formats.filter((format) => format.descriptor === value).length !== 0).map((hero) => (
                <Grid key={hero._id} item xs={2}>
                    <HeroCard hero={hero} matches={matches}/>
                </Grid>
            ))}
        </Grid>
    );
}