/**
 * Dialog that handles user login.
 */
import {useRecoilState} from "recoil";
import {Button, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Stack} from '@mui/material';
import {dialogOpenState, useLoginForm} from "../_userUtils";
import {FormFields} from "./FormFields";
import PasswordForgot from "./PasswordForgot";


export default function LoginDialog() {
    const [{handleChange, loginUser, LOGIN_FIELDS}] = useLoginForm({username: '', password: ''}, {username: null, password: null})
    const [, setOpen] = useRecoilState(dialogOpenState);

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
    }

    return (
        <>
            <Box noValidate component="form" onSubmit={handleSubmit}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Login with username or e-mail:
                    </DialogContentText>
                    <Box
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                    >
                        <FormFields fields={LOGIN_FIELDS} handleChange={handleChange}/>
                        <Stack alignItems={"flex-end"}>

                            <PasswordForgot/>
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type={"submit"}>Login</Button>
                </DialogActions>
            </Box>
        </>
    );
}
