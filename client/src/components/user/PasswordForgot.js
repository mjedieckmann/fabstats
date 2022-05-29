import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function PasswordForgot() {
    const [ passwordForgotDialogOpen, setPasswordForgotDialogOpen ] = useState(false);
    const [ form, setForm ] = useState({username: ''});

    const handlePasswordForgotDialogOpen = () => {
        setPasswordForgotDialogOpen(true);
    };

    const handlePasswordForgotDialogClose = () => {
        setPasswordForgotDialogOpen(false);
    };

    const handleForgotPassword = () => {
        axios.post("/users/forgot", form)
            .then(
                (res) => {console.log(res); setPasswordForgotDialogOpen(false)},
                () => console.log('Password forgot link could not be sent.'));
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
