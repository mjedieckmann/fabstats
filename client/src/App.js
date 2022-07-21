/**
 * The main application.
 * Defines the structure of our single-page application.
 */
import {useEffect} from "react";
import {Routes, Route, Navigate, Outlet, BrowserRouter} from "react-router-dom";
import axios from "axios";
import {useRecoilState} from "recoil";
import Stack from "@mui/material/Stack";
import {Paper} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Navbar from "./components/navbar/Navbar";
import {backgroundImgState, currentUserState, dirtyState} from "./utils/_globalState";
import {Footer} from "./components/footer/Footer";
import ScoreboardContainer from "./components/pages/scoreboard/ScoreboardContainer";
import About from "./components/pages/about/About";
import {PasswordReset} from "./components/navbar/user/authentication/PasswordReset";
import Heroes from "./components/pages/heroes/Heroes";

/**
 * Define two different variants for the paper component (a container component) that control its opacity.
 * Each paper component can then control its opacity by setting the "variant" property to one of styles that defined here.
 */
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

/**
 * The page layout.
 * "Outlet" refers to the child element that will be displayed, which depends on the current URL (see App).
 */
const Layout = () => {
    /* Recoil State variables can be manipulated anywhere in the application. */
    const [ currentUser, setCurrentUser ] = useRecoilState(currentUserState);
    const [ dirty, ] = useRecoilState(dirtyState);
    const [ backgroundImg, ] = useRecoilState(backgroundImgState);
    /* Set the background image. The image state depends on the current URL. */
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
    /* Load the current authentication from the database (defaults to "null"). */
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

/**
 * The application sets the displayed page based on the current URL.
 * The "Layout" Component always gets displayed, with the children depending on the rest of the URL.
 * Calling "/" will redirect to the scoreboard page.
 */
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<Layout/>}>
                        <Route path={"/"} element={ <Navigate to="/scoreboard" /> } />
                        <Route path={"scoreboard"} element={<ScoreboardContainer/>}/>
                        <Route path={"about"} element={<About/>}/>
                        <Route path={"heroes"} element={<Heroes/>}/>
                        <Route path={"reset-password/:token"} element={<PasswordReset/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
  );
}

export default App;
