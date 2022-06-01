import About from "./about/About";
import Heroes from "./heroes/Heroes";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import InfoIcon from "@mui/icons-material/Info";
import ScoreboardContainer from "./scoreboard/ScoreboardContainer";
import {atom} from "recoil";
import {useEffect} from "react";
import axios from "axios";
import {PasswordReset} from "../user/PasswordReset";

export const pages = [
    {
        url: '/about',
        name: 'About',
        element: <About/>,
    },
    {
        url: '/scoreboard',
        name: 'Scoreboard',
        element: <ScoreboardContainer/>,
    },
    {
        url: '/heroes',
        name: 'Heroes',
        element: <Heroes/>,
    },
    {
        url: '/reset-password/:token',
        name: 'Password Reset',
        element: <PasswordReset/>,
    },
]

export const nav_buttons = [
    {
        url: '/about',
        name: 'About',
        icon: <InfoIcon/>
    },
    {
        url: '/scoreboard',
        name: 'Scoreboard',
        icon: <ScoreboardIcon/>
    },
    /*{
        url: '/heroes',
        name: 'Heroes',
        icon: <ElderlyIcon/>
    },*/
]

export const eventsState = atom({
    key: 'events',
    default: [],
});

export const heroesState = atom({
    key: 'heroes',
    default: [],
});

export const useSimpleDataFetch = (setState, url, key) => {
    useEffect(() => {
        axios.get(url)
            .then(res => {
                let fetched_data = new Set();
                res.data.forEach((data) => {
                    fetched_data.add(data[key]);
                })
                setState([...fetched_data]);
            })
            .catch(err => console.log(err));
    },[setState, url, key]);
}