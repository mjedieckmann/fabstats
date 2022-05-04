import { Routes, Route, Link } from "react-router-dom";
import {useEffect, useState} from "react";

import './App.css';
import Login from "./components/user/login";
import Protected from "./components/user/protected";
import Register from "./components/user/register";
import Logout from "./components/user/logout";
import Heroes from "./components/heroes/heroes";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
    <div className="App">
        <h1>Welcome to skeleton page!</h1>
        <p>Logged in? {loggedIn ? 'YES' : 'NO'}</p>
        <Link to='/users/login'>Login</Link>
        <Link to='/users/register'>Register</Link>
        <Link to='/users/logout'>Logout</Link>
        <Link to='/heroes'>Heroes</Link>
        <Link to='/users/protected-route'>Protected Route</Link>
        <Routes>
            <Route path="/users/login" element={<Login setLoggedIn={setLoggedIn}/>}/>
            <Route path="/users/register" element={<Register setLoggedIn={setLoggedIn}/>} />
            <Route path="/users/logout" element={<Logout setLoggedIn={setLoggedIn}/>}/>
            <Route path="/heroes" element={<Heroes />} />
            <Route path="/users/protected-route" element={<Protected />}/>
        </Routes>
    </div>
  );
}

export default App;
