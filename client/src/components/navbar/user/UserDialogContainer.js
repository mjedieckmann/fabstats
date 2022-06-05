/**
 * The user dialog contains both authentication forms (register / login) and the user profile, depending on whether a
 * user is logged in.
 */

import Dialog from '@mui/material/Dialog';
import AuthenticationTabs from "./authentication/AuthenticationTabs";
import {useRecoilState} from "recoil";
import {dialogOpenState} from "./_userUtils";
import ProfileDialog from "./profile/ProfileDialog";
import {currentUserState} from "../../../utils/_globalState";
import ProfileMenu from "./profile/ProfileMenu";
import Button from "@mui/material/Button";

export default function UserDialogContainer() {
    const [ open, setOpen ] = useRecoilState(dialogOpenState);;
    const [ currentUser, ] = useRecoilState(currentUserState);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            {currentUser !== null
                ? <ProfileMenu handleOpen={handleOpen}/>
                : <Button size={"small"} variant="outlined" onClick={handleOpen} sx={{whiteSpace: "nowrap", minWidth: "auto"}}>Login / Register</Button>
            }
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
                {currentUser !== null
                    ? <ProfileDialog/>
                    : <AuthenticationTabs/>
                }
            </Dialog>
        </>
    );
}
