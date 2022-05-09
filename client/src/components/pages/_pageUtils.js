import About from "./About";
import Scoreboard from "./Scoreboard";
import Heroes from "./Heroes";
import Login from "../user/login";
import {useEffect} from "react";
import {atom, useRecoilState} from "recoil";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import InfoIcon from "@mui/icons-material/Info";
import ElderlyIcon from "@mui/icons-material/Elderly";

export const currentPageState = atom({
    key: 'currentPage',
    default: 'Scoreboard',
});

export function useCurrentPage(page){
    const [, setCurrentPage] = useRecoilState(currentPageState);
    useEffect(() => {
        setCurrentPage(page);
    }, []);
}

export const pages = [
    {
        url: '/about',
        name: 'About',
        element: <About/>,
    },
    {
        url: '/scoreboard',
        name: 'Scoreboard',
        element: <Scoreboard/>,
    },
    {
        url: '/heroes',
        name: 'Heroes',
        element: <Heroes/>,
    },
    {
        url: '/users/login',
        name: 'Login',
        element: <Login/>,
    }
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
    {
        url: '/heroes',
        name: 'Heroes',
        icon: <ElderlyIcon/>
    },
]