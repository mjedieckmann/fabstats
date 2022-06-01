import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {useState, useEffect} from "react";
import axios from "axios";
import {useRecoilState} from "recoil";
import {currentUserState,EVENT_TYPES,eventsChangedState,} from "../../../utils/_globalState";
import {Grid, IconButton} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import uuid from "react-uuid";
import {TODetailDialog} from "./TODetailDialog";
import {capitalizeFirstLetter, entityIsEditableByUser, preventSubmitOnEnter} from "../../../utils/_globalUtils";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

const filter = createFilterOptions();

export default function EventDetailDialog(props) {
    const [ eventsChanged, setEventsChanged] = useState(uuid());
    const [ currentUser, ] = useRecoilState(currentUserState);
    let eventIsEditable = entityIsEditableByUser(props.form.event, currentUser);
    const [ eventDialogMode, setEventDialogMode ] = useState('view');
    const [ eventDialogOpen, setEventDialogOpen ] = useState(false);
    const [ eventForm, setEventForm ] = useState({_id: null, descriptor: '', event_type: 'On Demand', to: ''});

    const [ events, setEvents ] = useState([]);
    useEffect(() =>{
        axios.get('/api/events')
            .then(res => {
                let events = new Set();
                res.data.forEach(event => {
                    events.add(event);
                })
                setEvents([...events]);
            });
    }, [eventsChanged]);

    const handleOpenEventDetail = (mode) => {
        switch (mode){
            case 'create':
                props.setForm({
                    ...props.form,
                    event: null
                });
                break;
            case 'view':
            case 'edit':
                setEventForm({
                    _id: props.form.event._id,
                    descriptor: props.form.event.descriptor,
                    event_type: props.form.event.event_type,
                    to: props.form.event.to,
                });
                break;
        }
        setEventDialogMode(mode);
        setEventDialogOpen(true);
    };

    const handleClose = () => {
        props.setHasChanged(true);
        setEventsChanged(uuid());
        setEventDialogOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (eventDialogMode === 'view'){
            setEventDialogOpen(false);
        } else {
            axios.post("/api/event/" + eventDialogMode, eventForm)
                .then((res) => {
                    props.setForm({...props.form, event: res.data});
                    handleClose();
                });
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteEvent = () => {
        axios.post("/api/event/delete", eventForm)
            .then((res) => {
                props.setForm({...props.form, event: null});
                setDeleteDialogOpen(false);
                handleClose();
            });
    }

    return (
        <>
            <Box display={"flex"}>
                <Autocomplete
                    id="event-autocomplete"
                    disabled={props.matchDialogMode === 'view'}
                    onChange={(e, newValue) => {
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                                setEventForm({
                                    _id: null,
                                    descriptor: newValue.descriptor,
                                    event_type: 'On Demand',
                                    to: null,
                                });
                                handleOpenEventDetail('create');
                            });
                        } else if (newValue && newValue.inputValue) {
                            setEventForm({
                                _id: null,
                                descriptor: newValue.inputValue,
                                event_type: 'On Demand',
                                to: null,
                            });
                            handleOpenEventDetail('create');
                        } else {
                            props.setForm({
                                ...props.form,
                                event: newValue
                            });
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        if (params.inputValue !== '' && !filtered.some(e => e.descriptor === params.inputValue)) {
                            filtered.push({
                                inputValue: `${params.inputValue} `,
                                descriptor: `create "${params.inputValue}"`,
                            });
                        }
                        return filtered;
                    }}
                    options={events}
                    getOptionLabel={(option) => {
                        // e.g value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.descriptor;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => <li {...props}>{option.descriptor}</li>}
                    freeSolo
                    isOptionEqualToValue={(option, value) => {
                        return option._id === value._id;
                    }}
                    value={props.form.event}
                    renderInput={(params) =>
                        <TextField {...params}
                                   label="Event"
                                   onKeyDown={preventSubmitOnEnter}
                        />}
                />
                <IconButton sx={props.form.event !== null ? {my: "auto"} : {display: 'none'}} onClick={() => handleOpenEventDetail(eventIsEditable ? 'edit' : 'view')}>
                    {eventIsEditable
                        ? <EditIcon />
                        : <VisibilityIcon />
                    }
                </IconButton>
            </Box>
            <Dialog open={eventDialogOpen} onClose={() => setEventDialogOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {capitalizeFirstLetter(eventDialogMode) + " Event"}
                        <DeleteConfirmationDialog
                            sx={eventDialogMode === 'edit' ? {} : {display: 'none'}}
                            deleteDialogOpen={deleteDialogOpen}
                            setDeleteDialogOpen={setDeleteDialogOpen}
                            handleDelete={handleDeleteEvent}
                            entity={'event'}
                            />
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item lg={12}>
                                <TextField
                                    autoFocus
                                    disabled={eventDialogMode === 'view'}
                                    margin="dense"
                                    id="event-input"
                                    value={eventForm.descriptor}
                                    onChange={(event) =>
                                        setEventForm({
                                            ...eventForm,
                                            descriptor: event.target.value,
                                        })
                                    }
                                    label="Event name"
                                    type="text"
                                    variant="standard"
                                />
                            </Grid>
                            <Grid item lg={12}>
                                <Autocomplete
                                    id="event-type-input"
                                    options={EVENT_TYPES}
                                    value={eventForm.event_type}
                                    onChange={(event, newValue) =>
                                        setEventForm({
                                            ...eventForm,
                                            event_type: newValue,
                                        })
                                    }
                                    disabled={eventDialogMode === 'view'}
                                    renderInput={(params) =>
                                        <TextField {...params}
                                                   required
                                            // error={dialogValue.event_type === null}
                                            // helperText={dialogValue.event_type === null ? 'Required' : ''}
                                                   margin="dense"
                                                   label="Event Type"
                                                   type="text"
                                                   variant="standard"
                                        />}
                                />
                            </Grid>
                            <Grid item lg={12}>
                                <TODetailDialog setHasChanged={props.setHasChanged} eventDialogMode={eventDialogMode} eventForm={eventForm} setEventForm={setEventForm}/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button sx={eventDialogMode !== 'view' ? {} : {display: 'none'}} onClick={() => setEventDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">OK</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}