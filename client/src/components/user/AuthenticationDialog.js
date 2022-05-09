import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AuthenticationTabs from "./AuthenticationTabs";
import {useRecoilState} from "recoil";
import {dialogOpenState} from "./_formUtils";

export default function AuthenticationDialog() {
    const [ open, setOpen ] = useRecoilState(dialogOpenState);;

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen}>
                Login
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
                <AuthenticationTabs/>
            </Dialog>
        </div>
    );
}
