/**
 * Handles viewing, creating, and editing matches.
 * Only the creator of a match can edit it.
 */

import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import uuid from "react-uuid";
import axios from "axios";
import {
    Fab,
    Grid,
    Dialog,
    Box,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    Autocomplete,
    TextField,
    Typography, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {DesktopDatePicker, LocalizationProvider} from "@mui/lab";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EventDetailDialog from "./EventDetailDialog";
import {SimpleAutocomplete} from "./SimpleAutocomplete";
import {dirtyState, ROUNDS} from "../../../../utils/_globalState";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {capitalizeFirstLetter, preventSubmitOnEnter, useNotification} from "../../../../utils/_globalUtils";
import {Row} from "./Row";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import {styled} from "@mui/material/styles";

const EMPTY_FORM = {
    _id : null,
    date: new Date(),
    round: null,
    event: null,
    hero_winner: null,
    hero_loser: null,
    user_winner: null,
    user_loser: null,
    format: null,
    meta: null,
    created_by: null,
    notes: ''
}

const UserAvatar = styled(Avatar)(({ theme }) => ({
    border: `2px solid ${theme.palette.background.paper}`,
}));

export default function MatchDetailDialog(props) {
    const [ open, setOpen ] = useState(false);
    const [ form, setForm ] = useState(EMPTY_FORM);
    const [ heroes, setHeroes ] = useState([]);
    const [ ,setDirty] = useRecoilState(dirtyState);
    const [ hasChanged, setHasChanged ] = useState(false);
    const showNotification = useNotification();

    // Make sure that affected components are reloaded if we made changes in the database.
    useEffect(() => {
        if (hasChanged && !open){
            setDirty(uuid());
            setHasChanged(false);
        }
    }, [hasChanged, open, setDirty]);

    // Fetch data from the database
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                setHeroes(res.data);
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }, []);
    const [ users, setUsers ] = useState([]);
    useEffect(() =>{
        axios.get('/users')
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }, []);
    const [ formats, setFormats ] = useState([]);
    useEffect(() =>{
        axios.get('/api/formats')
            .then(res => {
                setFormats(res.data);
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }, []);
    const [ metas, setMetas ] = useState([]);
    useEffect(() =>{
        axios.get('/api/metas')
            .then(res => {
                setMetas(res.data);
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }, []);

    // Load the match detail data if in "edit" or "view" mode.
    const handleOpen = () => {
        if (props.matchDialogMode !== 'create'){
            axios.get(props.row.url)
                .then(res => {
                    setForm({
                        _id : res.data._id,
                        date: res.data.date,
                        event: res.data.event,
                        round: res.data.round,
                        hero_winner: res.data.hero_winner,
                        hero_loser: res.data.hero_loser,
                        user_winner: res.data.user_winner,
                        user_loser: res.data.user_loser,
                        format: res.data.format,
                        meta: res.data.meta,
                        created_by: res.data.created_by,
                        notes: res.data.notes === null ? '' : res.data.notes
                    });
                    setOpen(true);
                })
                .catch(err => showNotification(err.response.data.message, 'error'));
        } else {
            setForm(EMPTY_FORM);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Create / edit handler.
    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (props.matchDialogMode !== 'view') {
            axios.post("/api/match/" + props.matchDialogMode, form)
                .then(res => {
                    setHasChanged(true);
                    showNotification(res.data.message);
                    handleClose();
                })
                .catch(err => showNotification(err.response.data.message, 'error'));
        } else {
            handleClose();
        }
    }

    // Delete handler.
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteMatch = () => {
        axios.post("/api/match/delete", form)
            .then((res) => {
                setHasChanged(true);
                showNotification(res.data.message);
                setDeleteDialogOpen(false);
                handleClose();
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }
    return (
        <>
            {/* For create mode, the dialog is controlled by a big plus button in the center of the application. */}
            {/* Editing and viewing is controlled by the scoreboard table rows. */}
            {props.matchDialogMode === 'create'
                ? <Fab color="primary" aria-label="add" onClick={handleOpen}><AddIcon /></Fab>
                : <Row key={props.row._id} row={props.row} handleOpen={handleOpen}/>
            }
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'lg'}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <DialogTitle>
                            {capitalizeFirstLetter(props.matchDialogMode) + " Match"}
                            <DeleteConfirmationDialog
                                sx={props.matchDialogMode === 'edit' ? {} : {display: 'none'}}
                                deleteDialogOpen={deleteDialogOpen}
                                setDeleteDialogOpen={setDeleteDialogOpen}
                                handleDelete={handleDeleteMatch}
                                entity={'match'}
                            />
                        </DialogTitle>
                        <DialogContent>
                            <Box >
                                <Grid container spacing={2} justifyContent={"center"} alignItems={"center"}>
                                    <Grid item xs={12} >
                                        <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={10}>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={<UserAvatar alt={form.user_winner?.nick} src={form.user_winner?.img} />}
                                            >
                                                <Avatar alt={form.hero_winner?.name} src={form.hero_winner?.img} sx={{width: 100, height: 100, border: '2px solid green'}}/>
                                            </Badge>
                                            <Typography variant={"h3"}>
                                                Vs.
                                            </Typography>
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={<UserAvatar alt={form.user_loser?.nick} src={form.user_loser?.img} />}
                                            >
                                                <Avatar alt={form.hero_loser?.name} src={form.hero_loser?.img} sx={{width: 100, height: 100, border: '2px solid red'}}/>
                                            </Badge>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                                        <Stack direction={"row"} justifyContent={"center"}>
                                            <Autocomplete
                                                id={"user-winner-input"}
                                                disabled={props.matchDialogMode === 'view'}
                                                options={users}
                                                name={"user_winner"}
                                                onChange={(event, newValue) => {
                                                    setForm({...form, user_winner: newValue});
                                                }}
                                                // We are working with objects. This ensures that the right property is used for comparison.
                                                isOptionEqualToValue={(option, value) => {
                                                    return option._id === value._id;
                                                }}
                                                // We are working with objects. This ensures that the right property gets displayed.
                                                getOptionLabel={(option) => {
                                                    if (option.inputValue) {
                                                        return option.inputValue;
                                                    }
                                                    return option.nick;
                                                }}
                                                value={form.user_winner}
                                                // We are working with objects. This ensures that the right property gets displayed.
                                                renderInput={(params) => <TextField {...params} label="Player (winner)" onKeyDown={preventSubmitOnEnter}/>}
                                            />
                                            <SimpleAutocomplete disabled={props.matchDialogMode === 'view'} handle="hero_winner" options={heroes} label="Hero (winner)" form={form} setForm={setForm} required={true}/>
                                            <SimpleAutocomplete disabled={props.matchDialogMode === 'view'} handle="hero_loser" options={heroes} label="Hero (loser)" form={form} setForm={setForm} required={true}/>
                                            <Autocomplete
                                                id={"user-loser-input"}
                                                disabled={props.matchDialogMode === 'view'}
                                                options={users}
                                                name={"user_loser"}
                                                onChange={(event, newValue) => {
                                                    setForm({...form, user_loser: newValue});
                                                }}
                                                // We are working with objects. This ensures that the right property is used for comparison.
                                                isOptionEqualToValue={(option, value) => {
                                                    return option._id === value._id;
                                                }}
                                                // We are working with objects. This ensures that the right property gets displayed.
                                                getOptionLabel={(option) => {
                                                    if (option.inputValue) {
                                                        return option.inputValue;
                                                    }
                                                    return option.nick;
                                                }}
                                                value={form.user_loser}
                                                // We are working with objects. This ensures that the right property gets displayed.
                                                renderInput={(params) => <TextField {...params} label="Player (loser)" onKeyDown={preventSubmitOnEnter}/>}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                                        <Stack direction={"row"} justifyContent={"center"}>
                                            {/*Round*/}
                                            <Autocomplete
                                                id={"round-input"}
                                                disabled={props.matchDialogMode === 'view'}
                                                options={ROUNDS}
                                                sx={{color:"red"}}
                                                name={"round"}
                                                onChange={(event, newValue) => {
                                                    setForm({...form, round : newValue});
                                                }}
                                                value={form.round}
                                                renderInput={(params) =>
                                                    <TextField {...params}
                                                               label={"Round"}
                                                               required
                                                               onKeyDown={preventSubmitOnEnter}/>}
                                            />
                                            {/*Format*/}
                                            <SimpleAutocomplete disabled={props.matchDialogMode === 'view'} handle="format" options={formats} label="Format" form={form} setForm={setForm} required={true}/>
                                            {/*Meta*/}
                                            <SimpleAutocomplete disabled={props.matchDialogMode === 'view'} handle="meta" options={metas} label="Meta" form={form} setForm={setForm} required={true}/>
                                            {/*Date*/}
                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DesktopDatePicker
                                                    label="Date"
                                                    value={form.date}
                                                    disabled={props.matchDialogMode === 'view'}
                                                    minDate={new Date('2017-01-01')}
                                                    onChange={(newValue) => {
                                                        setForm({...form, date: newValue});
                                                    }}
                                                    renderInput={(params) => <TextField {...params} error={false} required />}
                                                />
                                            </LocalizationProvider>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                                        <Stack direction={"row"} justifyContent={"center"}>
                                            {/*Dialog to view / edit the event.*/}
                                            <EventDetailDialog setHasChanged={setHasChanged} setForm={setForm} form={form} matchDialogMode={props.matchDialogMode}/>
                                            {/*Readonly event details.*/}
                                            <TextField
                                                disabled={true}
                                                margin="dense"
                                                id="event_type_view"
                                                value={form.event !== null ? form.event.event_type : ''}
                                                label="Even type"
                                                type="text"
                                                variant="standard"
                                            />
                                            <TextField
                                                disabled={true}
                                                margin="dense"
                                                id="event_to_view"
                                                value={form.event !== null && form.event.to !== null ? form.event.to.descriptor : ''}
                                                label="TO"
                                                type="text"
                                                variant="standard"
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={3}/>
                                    <Grid item xs={6}>
                                        {/*(Notes)*/}
                                        <TextField
                                            fullWidth={true}
                                            id="notes-input"
                                            label="Notes"
                                            multiline
                                            minRows={3}
                                            value={form.notes}
                                            onChange={(newValue) => {
                                                setForm({...form, notes: newValue.target.value});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}/>
                                </Grid>

                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button sx={props.matchDialogMode !== 'view' ? {} : {display: 'none'}} onClick={handleClose}>Cancel</Button>
                            <Button color={"success"} type={"submit"}>OK</Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
