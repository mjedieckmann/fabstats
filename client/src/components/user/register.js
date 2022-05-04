import {useEffect, useState} from "react";

import handlePostResponse from "./utils";

function Register(props) {
    const [username, setUsername] = useState('');
    const [e_mail, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleRegister(e) {
        e.preventDefault();
        console.log('You clicked register.');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, e_mail, password })
        };
        fetch('/users/register', requestOptions)
            .then(handlePostResponse)
            .then(() => fetch('/users/login', requestOptions).then(handlePostResponse).then(() => props.setLoggedIn(true), () => props.setLoggedIn(false)))
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
    return (
        <form onSubmit={handleRegister}>
            <label>
                Username:
                <input value={username} onInput={e => setUsername(e.target.value)}/>
            </label>
            <label>
                E-mail:
                <input value={e_mail} onInput={e => setEmail(e.target.value)}/>
            </label>
            <label>
                Password:
                <input value={password} onInput={e => setPassword(e.target.value)}/>
            </label>
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
