import {Helmet, HelmetProvider} from "react-helmet-async";
import {Routes, Route} from "react-router-dom";
import {Grid} from "@mui/material";

// import './App.css';
import Navbar from "./components/navbar/Navbar";
import {pages} from "./components/pages/_pageUtils";

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
            <Navbar />
            {/* Body */}
           <Grid container spacing={2}>
               <Routes>
                   {pages.map((page) => (
                       <Route key={page.name} path={page.url} element={page.element}/>
                   ))}
               </Routes>
           </Grid>
        </div>
  );
}

export default App;
