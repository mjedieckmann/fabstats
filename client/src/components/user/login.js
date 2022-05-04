import {useEffect, useState} from "react";
import handlePostResponse from "./utils";

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleLogin(e) {
        e.preventDefault();
        console.log('You clicked login.');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        };
        fetch('/users/login', requestOptions)
            .then(handlePostResponse)
            .then(() => props.setLoggedIn(true), () => props.setLoggedIn(false))
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    return (
        <form onSubmit={handleLogin}>
            <label>
                Username or e-mail:
                <input value={username} onInput={e => setUsername(e.target.value)}/>
            </label>
            <label>
                Password:
                <input value={password} onInput={e => setPassword(e.target.value)}/>
            </label>
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;
