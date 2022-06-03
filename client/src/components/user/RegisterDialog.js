import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import {dialogOpenState, useRegisterForm} from "./_formUtils";
import {FormFields} from "./FormFields";
import {useRecoilState} from "recoil";

export default function RegisterDialog(props) {
    const [{handleChange, registerUser, REGISTER_FIELDS}] = useRegisterForm(
        {username: '', e_mail: '', password: '', password_repeat: ''},
        {username: null, e_mail: null, password: null, password_repeat: null},
        props.setTab
    )
    const [, setOpen] = useRecoilState(dialogOpenState);

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser();
    }

    return (
        <Box noValidate component="form" onSubmit={handleSubmit}>
            <DialogTitle>Register</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    No account? Create one here:
                </DialogContentText>
                <Box

                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                >
                    <FormFields fields={REGISTER_FIELDS} handleChange={handleChange}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type={"submit"}>Register</Button>
            </DialogActions>
        </Box>
    );
}
