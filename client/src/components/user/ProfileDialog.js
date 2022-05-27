import {Avatar, Grid, IconButton} from "@mui/material";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import {useRecoilState} from "recoil";
import {currentUserState, dirtyState} from "../../utils/_globalState";
import axios from "axios";
import uuid from "react-uuid";
import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {dialogOpenState} from "./_formUtils";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";

const Input = styled('input')({
    display: 'none',
});

const EMPTY_FORM = {
    _id : null,
    nick: '',
    e_mail: '',
    password: '',
    password_new: '',
    password_repeat: '',
    team: null,
    file: null,
}

export default function ProfileDialog() {
    const [ , setOpen ] = useRecoilState(dialogOpenState);;
    const [ currentUser, ] = useRecoilState(currentUserState);
    const [ ,setDirty ] = useRecoilState(dirtyState);
    const [ form, setForm ] = useState(EMPTY_FORM);
    useEffect(() => {
        setForm((prevState) => ({
            ...prevState,
            _id: currentUser._id,
            nick: currentUser.nick,
            e_mail: currentUser.e_mail,
            team: currentUser.team !== null ? {label: currentUser.team.nick, id: currentUser.team._id} : null,
            file: currentUser.img,
        }));
    }, [currentUser])
    const [ teams, setTeams ] = useState([]);
    const [ preview, setPreview ] = useState(null);
    useEffect(() => {
        axios.get('/users/teams')
            .then(res => {
                let teams = new Set();
                res.data.forEach(team => {
                    teams.add({label: team.nick, id: team._id});
                })
                setTeams([...teams]);
            });
    }, [currentUser])

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (form.file === null || typeof form.file === 'string' || form.file instanceof String) {
            setPreview(form.file);
            return;
        }
        const objectUrl = URL.createObjectURL(form.file)
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [form.file])

    const [checked, setChecked] = useState(false);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    useEffect(() => {
        if (!checked) {
            setForm((prevState) => ({
                ...prevState,
                password: '',
                password_new: '',
                password_repeat: '',
            }))
        }
    }, [checked])

    const userAvatarUpload = (event) => {
        setForm((prevState) => ({
            ...prevState,
            file: event.target.files[0],
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.file !== null && typeof form.file !== 'string' && !(form.file instanceof String)){
            const data = new FormData()
            data.append('file', form.file);
            axios.post("/users/upload", data, {})
                .then(res => {
                    setDirty(uuid());
                });
        }
        axios.post("/users/edit", form, {})
            .then(res => {
                setDirty(uuid());
                setOpen(false);
            });
    }

    return (
        <Box noValidate component="form" onSubmit={handleSubmit}>
            <DialogTitle>User Profile</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <label htmlFor="user-avatar-file">
                                <Input accept="image/*" id="user-avatar-file" type="file" onChange={userAvatarUpload}/>
                                <IconButton color="primary" aria-label="upload picture" component="span">
                                    <Avatar alt={currentUser.nick} src={preview} sx={{ width: 156, height: 156 }} />
                                </IconButton>
                            </label>
                        </Stack>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="nick-input"
                            label="Nick"
                            value={form.nick}
                            variant="standard"
                            onInput={e => setForm(prevState => ({
                                ...prevState,
                                nick: e.target.value
                            }))}
                            size={"small"}
                            autoComplete={"username"}
                            type={"text"}
                        />
                        <TextField
                            id="email-input"
                            label="E-mail"
                            value={form.e_mail}
                            variant="standard"
                            onInput={e => setForm(prevState => ({
                                ...prevState,
                                e_mail: e.target.value
                            }))}
                            size={"small"}
                            autoComplete={"username"}
                            type={"email"}
                        />
                        <Autocomplete
                            id="team-input"
                            freeSolo
                            options={teams}
                            value={form.team}
                            onInputChange={(event, newInput) => {
                                setForm({
                                    ...form,
                                    team: newInput,
                                });
                            }}
                            renderInput={(params) =>
                                <TextField {...params}
                                           margin="dense"
                                           label="Team"
                                           type="text"
                                           variant="standard"
                                />}
                        />
                        <FormControlLabel
                            control={<Switch checked={checked} onChange={handleChange} />}
                            label="Change password"
                        />
                        <Box
                            sx={{
                                '& > :not(style)': {
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                },
                            }}
                        >
                            <Collapse in={checked}>
                                <TextField
                                    id="password-input"
                                    label="Old password"
                                    value={form.password}
                                    variant="standard"
                                    onInput={e => setForm(prevState => ({
                                        ...prevState,
                                        password: e.target.value
                                    }))}
                                    autoComplete={"password"}
                                    type={"password"}
                                    size={"small"}
                                />
                                <TextField
                                    id="password-new-input"
                                    label="New password"
                                    value={form.password_new}
                                    variant="standard"
                                    onInput={e => setForm(prevState => ({
                                        ...prevState,
                                        password_new: e.target.value
                                    }))}
                                    autoComplete={"new-password"}
                                    type={"password"}
                                    size={"small"}
                                />
                                <TextField
                                    id="password-repeat-input"
                                    label="New password (repeat)"
                                    value={form.password_repeat}
                                    variant="standard"
                                    onInput={e => setForm(prevState => ({
                                        ...prevState,
                                        password_repeat: e.target.value
                                    }))}
                                    autoComplete={"new-password"}
                                    type={"password"}
                                    size={"small"}
                                />
                            </Collapse>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type={"submit"}>Save</Button>
            </DialogActions>
        </Box>
    );
}
