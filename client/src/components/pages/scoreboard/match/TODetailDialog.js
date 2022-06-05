/**
 * Handles viewing, creating, and editing TOs.
 * To create a new TO, the freeform autocomplete gives an option if the input does not match any existing TO.
 * If the current user is the creator of the currently selected TO, they can edit it by using the respective button.
 * Otherwise, the detail form can be viewed instead.
 */
import {useState, useEffect} from "react";
import {useRecoilState} from "recoil";
import uuid from "react-uuid";
import axios from "axios";
import {IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Box} from "@mui/material";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {capitalizeFirstLetter, entityIsEditableByUser, useNotification} from "../../../../utils/_globalUtils";
import DeleteConfirmationDialog from "../../../pages/scoreboard/match/DeleteConfirmationDialog";
import {currentUserState} from "../../../../utils/_globalState";

const filter = createFilterOptions();

export const TODetailDialog = (props) => {
    /* When the TO detail dialog is closed, the list of TOs needs to be reloaded from the database. */
    const [ tosChanged, setTosChanged] = useState(uuid());
    const [ currentUser, ] = useRecoilState(currentUserState);
    let toIsEditable = entityIsEditableByUser(props.eventForm.to, currentUser);
    const [ toDialogMode, setToDialogMode ] = useState('view');
    const [ tos, setTos ] = useState([]);

    useEffect(() => {
        const showNotification = useNotification();
        axios.get('/api/tos')
            .then(res => {
                setTos(res.data);
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }, [tosChanged]);
    const [ toForm, setToForm ] = useState({_id: null, descriptor: ''});
    const [ toDialogOpen, setToDialogOpen ] = useState(false);

    const handleOpenToDetail = (mode) => {
        switch (mode){
            case 'create':
                props.setEventForm({
                    ...props.eventForm,
                    to: null
                });
                break;
            case 'view':
            case 'edit':
                setToForm({
                    _id : props.eventForm.to._id,
                    descriptor: props.eventForm.to.descriptor
                })
                break;
        }
        setToDialogMode(mode);
        setToDialogOpen(true)
    }

    const handleClose = () => {
        props.setHasChanged(true);
        setTosChanged(uuid());
        setToDialogOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (toDialogMode === 'view'){
            setToDialogOpen(false);
        } else {
            axios.post('/api/to/' + toDialogMode, toForm)
                .then(res => {
                    props.setEventForm({...props.eventForm, to: res.data.to});
                    showNotification(res.data.message);
                    handleClose();
                })
                .catch(err => showNotification(err.response.data.message, 'error'));
        }
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteTo = () => {
        axios.post("/api/to/delete", toForm)
            .then((res) => {
                props.setEventForm({...props.eventForm, to: null});
                showNotification(res.data.message);
                setDeleteDialogOpen(false);
                handleClose();
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }

    return(
        <>
            <Box display={"flex"}>
                {/* This autocomplete component is displayed in the event detail dialog. */}
                <Autocomplete
                    id="to-input"
                    sx={{m: "auto", width: 1}}
                    disabled={props.eventDialogMode === 'view'}
                    // Typing a new TO and selecting "create [input]..." will open the TO detail dialog in "create" mode.
                    onChange={(e, newValue) => {
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                                setToForm({
                                    _id: null,
                                    descriptor: newValue.descriptor
                                });
                                handleOpenToDetail('create');
                            });
                        } else if (newValue && newValue.inputValue) {
                            setToForm({
                                _id: null,
                                descriptor: newValue.inputValue
                            });
                            handleOpenToDetail('create');
                        } else {
                            props.setEventForm({
                                ...props.eventForm,
                                to: newValue
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
                    options={tos}
                    // We are working with objects. This ensures that the right property gets displayed.
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
                    // We are working with objects. This ensures that the right property gets displayed.
                    renderOption={(props, option) => <li {...props}>{option.descriptor}</li>}
                    freeSolo
                    // We are working with objects. This ensures that the right property is used for comparison.
                    isOptionEqualToValue={(option, value) => {
                        return option._id === value._id;
                    }}
                    value={props.eventForm.to}
                    renderInput={(params) =>
                        <TextField {...params} label="TO" />}
                />
                {/* Display the edit or view icon, depending on whether the user is the creator of the TO.
                Clicking the button will open the TO detail dialog.
                Only displays an icon if a TO is selected. */}
                <IconButton sx={props.eventForm.to !== null ? {my: "auto", ml: 1} : {display: 'none'}} onClick={() => handleOpenToDetail(toIsEditable ? 'edit' : 'view')}>
                    {toIsEditable
                        ? <EditIcon />
                        : <VisibilityIcon />
                    }
                </IconButton>
            </Box>
            {/* TO detail dialog to edit or delete an existing TO. */}
            <Dialog open={toDialogOpen} onClose={() => setToDialogOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {capitalizeFirstLetter(toDialogMode) + " TO" }
                        <DeleteConfirmationDialog
                            sx={toDialogMode === 'edit' ? {} : {display: 'none'}}
                            deleteDialogOpen={deleteDialogOpen}
                            setDeleteDialogOpen={setDeleteDialogOpen}
                            handleDelete={handleDeleteTo}
                            entity={'to'}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            disabled={toDialogMode === 'view'}
                            required
                            error={toForm.descriptor === ''}
                            helperText={toForm.descriptor === '' ? 'Required' : ''}
                            margin="dense"
                            id="event-input"
                            value={toForm.descriptor}
                            onChange={(event) =>
                                setToForm({
                                    ...toForm,
                                    descriptor: event.target.value,
                                })
                            }
                            label="TO name"
                            type="text"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button sx={toDialogMode !== 'view' ? {} : {display: 'none'}} onClick={() => setToDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">OK</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}