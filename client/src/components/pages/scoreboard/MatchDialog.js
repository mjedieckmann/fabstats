import Dialog from '@mui/material/Dialog';
import AddIcon from "@mui/icons-material/Add";
import {Fab} from "@mui/material";
import {useState} from "react";

export default function MatchDialog() {
    const [ open, setOpen ] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
                <AddIcon />
            </Fab>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
                {/*<AuthenticationTabs/>*/}
            </Dialog>
        </div>
    );
}
