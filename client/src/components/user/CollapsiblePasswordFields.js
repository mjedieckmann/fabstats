import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";

export default function CollapsiblePasswordFields(props) {
    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    useEffect(() => {
        if (!checked) {
            props.setForm({
                ...props.form,
                password: '',
                password_repeat: ''
            })
        }
    }, [checked])

    return (
        <Box sx={{ height: 300 }}>
            <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label="Show"
            />
            <Box
                sx={{
                    '& > :not(style)': {
                        display: 'flex',
                        justifyContent: 'space-around',
                    },
                }}
            >
                <Collapse orientation="horizontal" in={checked}>
                    <TextField
                        id="password-input"
                        label="Password"
                        value={props.form.password}
                        variant="standard"
                        onInput={e => props.setForm(prevState => ({
                            ...prevState,
                            password: e.target.value
                        }))}
                        size={"small"}
                    />
                    <TextField
                        id="password-repeat-input"
                        label="Password (repeat)"
                        value={props.form.password_repeat}
                        variant="standard"
                        onInput={e => props.setForm(prevState => ({
                            ...prevState,
                            password_repeat: e.target.value
                        }))}
                        size={"small"}
                    />
                </Collapse>
            </Box>
        </Box>
    );
}
