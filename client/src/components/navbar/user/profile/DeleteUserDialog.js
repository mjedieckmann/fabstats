/**
 * Confirmation dialog that is opened when the user tries to delete their account from the user profile.
 * Accepting the dialog will tell the backend to close the account.
 */
import {useState} from "react";
import {useRecoilState} from "recoil";
import uuid from "react-uuid";
import axios from "axios";
import {Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import {dirtyState} from "../../../../utils/_globalState";
import {useNotification} from "../../../../utils/_globalUtils";

export default function DeleteUserDialog(props) {
    const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
    const [ ,setDirty] = useRecoilState(dirtyState);
    const showNotification = useNotification()

    const handleUserDeleteDialogOpen = () => {
        setDeleteUserDialogOpen(true);
    };

    const handleUserDeleteDialogClose = () => {
        setDeleteUserDialogOpen(false);
    };

    const handleUserDelete = () => {
        axios.post("/users/delete", props.form)
            .then((res) => {
                setDirty(uuid());
                showNotification(res.data.message);
                handleUserDeleteDialogClose();
            })
            .catch(res => showNotification(res.response.data.message, 'error'));
    }

    return (
        <>
            <IconButton aria-label="delete-user" onClick={handleUserDeleteDialogOpen}>
                <DeleteIcon/>
            </IconButton>
            <Dialog
                open={deleteUserDialogOpen}
                onClose={handleUserDeleteDialogClose}
                aria-labelledby="delete-user-dialog-title"
                aria-describedby="delete-user-dialog-description"
            >
                <DialogTitle id="delete-user-dialog-title">
                    {"Do you really want to close your account?"}
                </DialogTitle>
                <DialogContent>
                    <Stack>
                        <DialogContentText id="delete-user-dialog-description">
                            Closing the account and deleting the user cannot be undone.
                            Please type your password to confirm:
                        </DialogContentText>
                        <TextField
                            id="password-input"
                            label="Password"
                            value={props.form.password}
                            variant="standard"
                            onInput={e => props.setForm(prevState => ({
                                ...prevState,
                                password: e.target.value
                            }))}
                            autoComplete={"password"}
                            type={"password"}
                            size={"small"}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUserDeleteDialogClose}>Cancel</Button>
                    <Button onClick={handleUserDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
