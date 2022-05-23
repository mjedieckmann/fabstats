import Dialog from '@mui/material/Dialog';
import {LoadingButton} from "@mui/lab";
import AuthenticationTabs from "./AuthenticationTabs";
import {useRecoilState} from "recoil";
import {dialogOpenState} from "./_formUtils";
import ProfileDialog from "./ProfileDialog";
import {currentUserState} from "../../utils/_globalState";

export default function DialogContainer() {
    const [ open, setOpen ] = useRecoilState(dialogOpenState);;
    const [ currentUser, ] = useRecoilState(currentUserState);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <LoadingButton loading={currentUser === 0} variant="outlined" onClick={handleOpen}>
                {currentUser !== null
                    ? "Profile"
                    : "Login"
                }
            </LoadingButton>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
                {currentUser !== null
                    ? <ProfileDialog/>
                    : <AuthenticationTabs/>
                }
            </Dialog>
        </div>
    );
}
