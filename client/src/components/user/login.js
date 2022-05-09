import {Grid} from "@mui/material";
import {useState} from "react";

function Login() {
    const [ username, setUsername] = useState('');
    const [ password, setPassword ] = useState('');

    return (
        <Grid item xs={12}>
            <label>
                Username or e-mail:
                <input value={username} onInput={e => setUsername(e.target.value)}/>
            </label>
            <label>
                Password:
                <input value={password} onInput={e => setPassword(e.target.value)}/>
            </label>
        </Grid>
    );
}

export default Login;
