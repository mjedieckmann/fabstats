import {Helmet, HelmetProvider} from "react-helmet-async";
import {Routes, Route, Navigate, Outlet, BrowserRouter} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Stack from "@mui/material/Stack";
import {useRecoilState} from "recoil";
import {backgroundImgState, currentUserState, dirtyState} from "./utils/_globalState";
import {useEffect} from "react";
import axios from "axios";
import {Footer} from "./components/footer/Footer";
import Image from './img/Eclipse_Full_Art.width-10000.jpg';
import {Paper} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import ScoreboardContainer from "./components/pages/scoreboard/ScoreboardContainer";
import About from "./components/pages/about/About";
import {PasswordReset} from "./components/user/PasswordReset";


const theme = createTheme({
    components: {
        MuiPaper: {
            variants: [
                {
                    props: { variant: 'opacity-0.8' },
                    style: {
                        backgroundColor: 'rgba(255,255,255,0.8)',
                    },
                },
                {
                    props: { variant: 'opacity-0.9'},
                    style: {
                        backgroundColor: 'rgba(255,255,255,0.9)',
                    },
                },
                ],
            },
        },
    },
);

const Layout = () => {
    const [ currentUser, setCurrentUser ] = useRecoilState(currentUserState);
    const [ dirty, ] = useRecoilState(dirtyState);
    const [ backgroundImg, ] = useRecoilState(backgroundImgState);
    const styles = {
        paperContainer: {
            backgroundImage: `url(${backgroundImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            minHeight: '100vh',
            backgroundAttachment: 'fixed',
        }
    };
    useEffect(() => {
        axios.get('/users/current')
            .then(res => {
                setCurrentUser(res.data.user);
            })
            .catch(err => console.log(err));
    }, [dirty, setCurrentUser])

    return (
        <Paper style={styles.paperContainer}>
            <ThemeProvider theme={theme}>
                <Stack spacing={2}>
                    <Navbar currentUser={currentUser}/>
                    <Stack sx={{minHeight: "90vH", justifyContent: "space-between"}}>
                        <Outlet/>
                        <Footer/>
                    </Stack>
                </Stack>
            </ThemeProvider>
        </Paper>
    )
}

function App() {
    return (
        <div className="App">
            <HelmetProvider>
                <Helmet>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <title>Flesh and Blood TCG Unofficial Statistics</title>
                </Helmet>
            </HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Layout/>}>
                        <Route path={"/"} element={ <Navigate to="/scoreboard" /> } />
                        <Route path={"scoreboard"} element={<ScoreboardContainer/>}/>
                        <Route path={"about"} element={<About/>}/>
                        <Route path={"reset-password/:token"} element={<PasswordReset/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
  );
}

export default App;
