import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from "@mui/icons-material/Delete";
import {IconButton} from "@mui/material";

export default function DeleteConfirmationDialog(props) {

    const handleDeleteDialogOpen = () => {
        props.setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        props.setDeleteDialogOpen(false);
    };

    return (
        <>
            <IconButton sx={props.sx} aria-label="delete" onClick={handleDeleteDialogOpen}>
                <DeleteIcon/>
            </IconButton>
            <Dialog
                open={props.deleteDialogOpen}
                onClose={handleDeleteDialogClose}
                aria-labelledby="delete-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Do you really want to delete this {props.entity}?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Deleting the {props.entity} cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button onClick={props.handleDelete} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
