import Snackbar from '@mui/material/Snackbar';
import {useRecoilState} from "recoil";
import MuiAlert from '@mui/material/Alert';
import {notificationState, notificationTypeState} from "../utils/_globalState";
import {forwardRef, useEffect, useState} from "react";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification() {
    const [ notification, setNotification ] = useRecoilState(notificationState);
    const [ notificationType, ] = useRecoilState(notificationTypeState);
    const [ open, setOpen ] = useState(false);
    const [ messageInfo, setMessageInfo ] = useState(undefined);

    useEffect(() => {
        if (notification.length && !messageInfo) {
            // Set a new snack when we don't have an active one
            setMessageInfo({ ...notification[0] });
            setNotification((prev) => prev.slice(1));
            setOpen(true);
        } else if (notification.length && messageInfo && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [notification, messageInfo, open]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setMessageInfo(undefined);
    };

    return (
        <>
            <Snackbar key={messageInfo ? messageInfo.key : undefined} open={open} autoHideDuration={6000} onClose={handleClose} TransitionProps={{ onExited: handleExited }}>
                <Alert onClose={handleClose} severity={notificationType} sx={{ width: '100%' }}>
                    {messageInfo
                        ? messageInfo.message
                        : ''
                    }
                </Alert>
            </Snackbar>
        </>
    );
}
