/**
 * Handles viewing, creating, and editing events.
 * To create a new event, the freeform autocomplete gives an option if the input does not match any existing event.
 * If the current user is the creator of the currently selected event, they can edit it by using the respective button.
 * Otherwise, the detail form can be viewed instead.
 */

import {useState, useEffect} from "react";
import {useRecoilState} from "recoil";
import uuid from "react-uuid";
import axios from "axios";
import {IconButton, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box} from "@mui/material";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import {currentUserState,EVENT_TYPES} from "../../../../utils/_globalState";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {TODetailDialog} from "./TODetailDialog";
import {capitalizeFirstLetter, entityIsEditableByUser, preventSubmitOnEnter, useNotification} from "../../../../utils/_globalUtils";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const filter = createFilterOptions();

export default function EventDetailDialog(props) {
    /* When the team detail dialog is closed, the list of events needs to be reloaded from the database. */
    const [ eventsChanged, setEventsChanged] = useState(uuid());
    const [ currentUser, ] = useRecoilState(currentUserState);
    let eventIsEditable = entityIsEditableByUser(props.form.event, currentUser);
    const [ eventDialogMode, setEventDialogMode ] = useState('view');
    const [ eventDialogOpen, setEventDialogOpen ] = useState(false);
    const [ eventForm, setEventForm ] = useState({_id: null, descriptor: '', event_type: 'On Demand', to: ''});
    const showNotification = useNotification();

    const [ events, setEvents ] = useState([]);
    useEffect(() =>{
        axios.get('/api/events')
            .then(res => {
                let events = new Set();
                res.data.forEach(event => {
                    events.add(event);
                })
                setEvents([...events]);
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }, [eventsChanged, showNotification]);

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
            default:
                props.setForm({
                    ...props.form,
                    event: null
                });
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
                    props.setForm({...props.form, event: res.data.event});
                    showNotification(res.data.message);
                    handleClose();
                })
                .catch(err => showNotification(err.response.data.message, 'error'));
        }
    };

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteEvent = () => {
        axios.post("/api/event/delete", eventForm)
            .then((res) => {
                props.setForm({...props.form, event: null});
                showNotification(res.data.message);
                setDeleteDialogOpen(false);
                handleClose();
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }

    return (
        <>
            <Box display={"flex"}>
                {/* This autocomplete component is displayed in the match detail dialog. It can only be edited if the current user can edit the match. */}
                <Autocomplete
                    id="event-autocomplete"
                    disabled={props.matchDialogMode === 'view'}
                    // Typing a new team and selecting "create [input]..." will open the team detail dialog in "create" mode.
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
                    // Makes the autocomplete display the "create [input]..." option depending on the user input.
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
                    // We are working with objects. This ensures that the right property gets displayed.
                    getOptionLabel={(option) => {
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
                    // We are working with objects. This ensures that the right property gets displayed.
                    renderOption={(props, option) => <li {...props}>{option.descriptor}</li>}
                    freeSolo
                    // We are working with objects. This ensures that the right property is used for comparison.
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
                {/* Display the edit or view icon, depending on whether the user is the creator of the event.
                Clicking the button will open the event detail dialog.
                Only displays an icon if a event is selected. */}
                <IconButton sx={props.form.event !== null ? {my: "auto"} : {display: 'none'}} onClick={() => handleOpenEventDetail(eventIsEditable ? 'edit' : 'view')}>
                    {eventIsEditable
                        ? <EditIcon />
                        : <VisibilityIcon />
                    }
                </IconButton>
            </Box>
            {/* Event detail dialog to edit or delete an existing event. */}
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
                                    required
                                    error={eventForm.descriptor === ''}
                                    helperText={eventForm.descriptor === '' ? 'Required' : ''}
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
                                                   error={eventForm.event_type === null}
                                                   helperText={eventForm.event_type === null ? 'Required' : ''}
                                                   margin="dense"
                                                   label="Event Type"
                                                   type="text"
                                                   variant="standard"
                                        />}
                                />
                            </Grid>
                            {/* Dialog to view / edit the TO of the event. */}
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