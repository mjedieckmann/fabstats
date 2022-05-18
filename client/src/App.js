import {Helmet, HelmetProvider} from "react-helmet-async";
import {Routes, Route} from "react-router-dom";
import {Container, Grid} from "@mui/material";

// import './App.css';
import Navbar from "./components/navbar/Navbar";
import {pages} from "./components/pages/_pageUtils";
import Stack from "@mui/material/Stack";

function App() {
    return (
        <div className="App">
            <HelmetProvider>
                <Helmet>
                    <meta name="viewport" content="initial-scale=1, width=device-width" />
                    <title>TODO: Title</title>
                </Helmet>
            </HelmetProvider>
            {/* Header */}
            <Stack spacing={2}>
                <Navbar/>
                <Routes>
                    {pages.map((page) => (
                        <Route key={page.name} path={page.url} element={page.element}/>
                    ))}
                </Routes>
            </Stack>
            {/* Body */}
           {/*<Grid container spacing={2}>*/}
           {/*</Grid>*/}
        </div>
  );
}

export default App;
