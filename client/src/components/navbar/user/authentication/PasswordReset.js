/**
 * Page that appears when the user follows the link they received in their "forgot password?" e-Mail.
 * The form can be used to set a new password.
 */
import {useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {Button, Typography, TextField, Stack, Box, Grid, Paper} from '@mui/material';
import {useNotification} from "../../../../utils/_globalUtils";

export const PasswordReset = () => {
    const url_params = useParams();
    const [ form, setForm ] = useState({password_new: '', password_repeat: '', token: url_params.token});
    const showNotification = useNotification();

    const resetPassword = () => {
        axios.post('/users/reset', form)
            .then(res => {
                showNotification(res.data.message);
                window.location.replace('/');
            })
            .catch(res => showNotification(res.response.data.message, 'error'));
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={3}/>
            <Grid item xs={6} textAlign={"center"}>
                <Paper sx={{py: 1}}>
                    <Typography variant="h4" fontWeight={"bold"} gutterBottom component="div">
                        Reset your password
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={3}/>
            <Grid item xs={3}/>
            <Grid item xs={6} sx={{textAlign:"center", mx: "auto"}}>
                <Paper sx={{py: 3}}>
                    <Box sx={{mx: 3, my: 2}}>
                        <Stack spacing={1}>
                            <TextField
                                id="password-new-input"
                                label="New password"
                                value={form.password_new}
                                variant="standard"
                                onInput={e => setForm(prevState => ({
                                    ...prevState,
                                    password_new: e.target.value
                                }))}
                                autoComplete={"new-password"}
                                type={"password"}
                                size={"small"}
                            />
                            <TextField
                                id="password-repeat-input"
                                label="New password (repeat)"
                                value={form.password_repeat}
                                variant="standard"
                                onInput={e => setForm(prevState => ({
                                    ...prevState,
                                    password_repeat: e.target.value
                                }))}
                                autoComplete={"new-password"}
                                type={"password"}
                                size={"small"}
                            />
                            <Button onClick={resetPassword}>OK</Button>
                        </Stack>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={3}/>
        </Grid>
    )
}