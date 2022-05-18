import {useEffect, useState} from "react";
import {Autocomplete} from "@mui/material";
import TextField from "@mui/material/TextField";
import {useRecoilState} from "recoil";
import {filteredMatchesState, matchesState, pageState} from "./ScoreboardContainer";

export const ScoreboardFilter = () =>{
    const [heroes, setHeroes] = useState([]);
    const [matches,] = useRecoilState(matchesState);
    const [,setPage] = useRecoilState(pageState);
    const [,setFilteredMatches] = useRecoilState(filteredMatchesState);

    useEffect(() => {
        fetch('/api/heroes')
            .then(response => response.json())
            .then(data => {
                let heroes = [];
                data.map((hero) => {
                    heroes.push({label: hero.name});
                })
                setHeroes(heroes);
            });
    },[]);

    const filterByHero = (hero) => {
        if (hero === null){
            return matches;
        }
        return matches.filter((row) => row.hero_a.name === hero.label);
    }

    return(
        <>
            <Autocomplete
                onChange={(event, newValue) => {
                    setPage(0);
                    setFilteredMatches(filterByHero(newValue));
                }}
                disablePortal
                id="hero-filter"
                options={heroes}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Hero" />}
            />
        </>
    )
}