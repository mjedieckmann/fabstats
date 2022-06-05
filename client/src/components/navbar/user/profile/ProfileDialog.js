/**
 * User profile dialog that can be accessed from the profile menu in the navbar.
 * The user can edit their avatar, nick, team, and password.
 */

import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import uuid from "react-uuid";
import axios from "axios";
import {Avatar, Grid, IconButton, Stack, TextField, DialogTitle, DialogContent, DialogActions, Button, Box, FormControlLabel, Switch, Collapse} from "@mui/material";
import {styled} from "@mui/material/styles";
import {currentUserState, dirtyState} from "../../../../utils/_globalState";
import {dialogOpenState} from "../_userUtils";
import DeleteUserDialog from "./DeleteUserDialog";
import {TeamDetailDialog} from "./TeamDetailDialog";
import {useNotification} from "../../../../utils/_globalUtils";

/* Hidden element used for file upload. */
const Input = styled('input')({
    display: 'none',
});

/* Initial form state */
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
    const showNotification = useNotification();
    const [ hasChanged, setHasChanged ] = useState(false);

    /* Set the form to contain the current user's data. */
    useEffect(() => {
        setForm((prevState) => ({
            ...prevState,
            _id: currentUser._id,
            nick: currentUser.nick,
            e_mail: currentUser.e_mail,
            team: currentUser.team,
            file: currentUser.img,
        }));
    }, [currentUser])
    const [ preview, setPreview ] = useState(null);
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

    /* Used to hide the "reset password" part of the form. */
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

    /* If the avatar has changed, first upload the file to the database, then save the user. Otherwise, just save the user. */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.file !== null && typeof form.file !== 'string' && !(form.file instanceof String)){
            const data = new FormData()
            data.append('file', form.file);
            console.log(data);
            axios.post("/users/upload", data, {})
                .then(res => {
                    showNotification(res.data.message);
                    setHasChanged(true);
                })
                .then(() => {
                    axios.post("/users/edit", form, {})
                        .then(res => {
                            setDirty(uuid());
                            showNotification(res.data.message);
                            handleClose();
                        })
                        .catch(res => showNotification(res.response.data.message, 'error'));
                })
                .catch(res => showNotification(res.response.data.message, 'error'));

        } else {
            axios.post("/users/edit", form, {})
                .then(res => {
                    setDirty(uuid());
                    showNotification(res.data.message);
                    handleClose();
                })
                .catch(res => showNotification(res.response.data.message, 'error'));
        }
    }

    const handleClose = () => {
        if (hasChanged) {
            setDirty(uuid());
        }
        setOpen(false);
    }

    return (
        <Box noValidate component="form" onSubmit={handleSubmit}>
            <DialogTitle>User Profile<DeleteUserDialog form={form} setForm={setForm}/></DialogTitle>
            <DialogContent>
                <Grid container>
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
                    <Grid item xs={7}>
                        <Stack spacing={2}>
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
                            {/* Dialog to view / edit the team the user is part of. */}
                            <TeamDetailDialog userForm={form} setUserForm={setForm} setHasChanged={setHasChanged}/>
                            <FormControlLabel
                                control={<Switch checked={checked} onChange={handleChange}/>}
                                label="Change password"
                            />
                        </Stack>
                        {/* "Change password" part of the form, hidden by default. */}
                            <Collapse in={checked}>
                                <Stack spacing={1}>
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
                                </Stack>
                            </Collapse>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type={"submit"}>Save</Button>
            </DialogActions>
        </Box>
    );
}
