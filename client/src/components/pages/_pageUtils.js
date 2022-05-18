import About from "./about/About";
import Heroes from "./heroes/Heroes";
import Login from "../user/login";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import InfoIcon from "@mui/icons-material/Info";
import ElderlyIcon from "@mui/icons-material/Elderly";
import Protected from "../user/protected";
import Logout from "../user/logout";
import ScoreboardContainer from "./scoreboard/ScoreboardContainer";

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
        url: '/users/login',
        name: 'Login',
        element: <Login/>,
    },
    {
        url: '/protected',
        name: 'Protected',
        element: <Protected/>,
    },
    {
        url: '/logout',
        name: 'Logout',
        element: <Logout/>,
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