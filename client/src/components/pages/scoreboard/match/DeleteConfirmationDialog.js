/**
 * Confirmation dialog that gets displayed when the user tries to delete a match, event, or TO.
 * Accepting the dialog will tell the backend to go through with the deletion.
 */
import {IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
