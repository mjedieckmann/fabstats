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
import uuid from "react-uuid";
import {useRecoilState} from "recoil";
import {dirtyState} from "../../../utils/_globalState";

export default function DeleteConfirmationDialog(props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ ,setDirty] = useRecoilState(dirtyState);

    const handleDeleteDialogOpen = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
    };

    const handleDelete = () => {
        axios.post("/api/match/delete", props.form)
            .then((res) => {
                console.log('deleted', res);
                setDirty(new uuid());
                handleDeleteDialogClose();
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <IconButton aria-label="delete" onClick={handleDeleteDialogOpen}>
                <DeleteIcon/>
            </IconButton>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    {"Do you really want to delete this match entry?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Deleting the match entry cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button onClick={handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
