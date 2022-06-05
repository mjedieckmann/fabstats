/**
 * Dialog that appears when the user clicks "forgot password?" in the login form.
 * Entering an e-Mail address and clicking "OK" will trigger the backend to send a password reset e-Mail.
 */
import {useState} from "react";
import axios from "axios";
import {Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Stack} from '@mui/material';
import {useNotification} from "../../../../utils/_globalUtils";

export default function PasswordForgot() {
    const [ passwordForgotDialogOpen, setPasswordForgotDialogOpen ] = useState(false);
    const [ form, setForm ] = useState({username: ''});
    const showNotification = useNotification();

    const handlePasswordForgotDialogOpen = () => {
        setPasswordForgotDialogOpen(true);
    };

    const handlePasswordForgotDialogClose = () => {
        setPasswordForgotDialogOpen(false);
    };

    const handleForgotPassword = () => {
        axios.post("/users/forgot", form)
            .then((res) => {
                showNotification(res.data.message);
                setPasswordForgotDialogOpen(false)
            })
            .catch(res => showNotification(res.response.data.message, 'error'));
    }

    return (
        <>
            <Button size={"small"} aria-label="forgot-password" onClick={handlePasswordForgotDialogOpen}>
                forgot password?
            </Button>
            <Dialog
                open={passwordForgotDialogOpen}
                onClose={handlePasswordForgotDialogClose}
                aria-labelledby="forgot-password-dialog-title"
                aria-describedby="forgot-password-dialog-description"
            >
                <DialogTitle id="forgot-password-dialog-title">
                    {"Reset your password?"}
                </DialogTitle>
                <DialogContent>
                    <Stack>
                        <DialogContentText id="delete-user-dialog-description">
                            Please provide your username or e-Mail address to receive a reset link:
                        </DialogContentText>
                        <TextField
                            id="e-mail-input"
                            label="E-Mail"
                            value={form.username}
                            variant="standard"
                            onInput={e => setForm(prevState => ({
                                ...prevState,
                                username: e.target.value
                            }))}
                            autoComplete={"username"}
                            type={"text"}
                            size={"small"}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handlePasswordForgotDialogClose}>Cancel</Button>
                    <Button onClick={handleForgotPassword} autoFocus>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
