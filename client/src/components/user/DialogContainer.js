import Dialog from '@mui/material/Dialog';
import AuthenticationTabs from "./AuthenticationTabs";
import {useRecoilState} from "recoil";
import {dialogOpenState} from "./_formUtils";
import ProfileDialog from "./ProfileDialog";
import {currentUserState} from "../../utils/_globalState";
import BasicMenu from "../navbar/BasicMenu";
import Button from "@mui/material/Button";

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
        <>
            {currentUser !== null
                ? <BasicMenu handleOpen={handleOpen}/>
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
