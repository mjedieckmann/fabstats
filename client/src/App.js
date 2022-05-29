import {Helmet, HelmetProvider} from "react-helmet-async";
import {Routes, Route, Navigate} from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import {pages} from "./components/pages/_pageUtils";
import Stack from "@mui/material/Stack";
import {useRecoilState} from "recoil";
import {currentUserState, dirtyState} from "./utils/_globalState";
import {useEffect} from "react";
import axios from "axios";
import {Footer} from "./components/footer/Footer";

import Image from './img/Seek_Enlightenment_Full_Art.width-10000.jpg';
import {Paper} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles"; // Import using relative path

const styles = {
    paperContainer: {
        backgroundImage: `url(${Image})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
    }
};

const theme = createTheme({
    components: {
        // Name of the component
        MuiPaper: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    backgroundColor: 'rgba(255,255,255,0.8)',
                },
            },
        },
    },
});

function App() {
    const [ currentUser, setCurrentUser ] = useRecoilState(currentUserState);
    const [ dirty, ] = useRecoilState(dirtyState);
    useEffect(() => {
        axios.get('/users/current')
            .then(res => {
                setCurrentUser(res.data.user);
            })
            .catch(err => console.log(err));
    }, [dirty, setCurrentUser])

    return (
        <div className="App">
            <HelmetProvider>
                <Helmet>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <title>Flesh and Blood TCG Unofficial Statistics</title>
                </Helmet>
            </HelmetProvider>
            <Paper style={styles.paperContainer}>
                <ThemeProvider theme={theme}>
                    <Stack spacing={2}>
                        {/* Header */}
                        <Navbar currentUser={currentUser}/>
                        {/*Body*/}
                        <Stack sx={{minHeight: "90vH", justifyContent: "space-between"}}>
                            <Routes>
                                <Route path="/" element={ <Navigate to="/scoreboard" /> } />
                                {pages.map((page) => (
                                    <Route key={page.name} path={page.url} element={page.element}/>
                                ))}
                            </Routes>
                            {/* Footer */}
                            <Footer/>
                        </Stack>
                    </Stack>
                </ThemeProvider>
            </Paper>
        </div>
  );
}

export default App;
