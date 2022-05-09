import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import {FormFields} from "./FormFields";
import {dialogOpenState, useLoginForm} from "./_formUtils";
import {useRecoilState} from "recoil";


export default function LoginDialog() {
    const [{handleChange, validateForm, LOGIN_FIELDS}] = useLoginForm({username: '', password: ''}, {username: null, password: null})
    const [, setOpen] = useRecoilState(dialogOpenState);


    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm().then(() => {
            console.log('no problem, continue LOGIN');
            setOpen(false);
        }, () =>
            console.log('LOGIN validation errors')
        );
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