import TextField from "@mui/material/TextField";
import Autocomplete, {createFilterOptions} from "@mui/material/Autocomplete";
import {IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useState, useEffect} from "react";
import axios from "axios";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../../utils/_globalState";
import uuid from "react-uuid";
import {capitalizeFirstLetter, entityIsEditableByUser} from "../../../utils/_globalUtils";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";

const filter = createFilterOptions();

export const TODetailDialog = (props) => {
    const [ tosChanged, setTosChanged] = useState(uuid());
    const [ currentUser, ] = useRecoilState(currentUserState);
    let toIsEditable = entityIsEditableByUser(props.eventForm.to, currentUser);
    const [ toDialogMode, setToDialogMode ] = useState('view');

    const [ tos, setTos ] = useState([]);
    useEffect(() => {
        axios.get('/api/tos')
            .then(res => {
                setTos(res.data);
            });
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
                    console.log(res);
                    props.setEventForm({...props.eventForm, to: res.data});
                    handleClose();
                });
        }
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteTo = () => {
        axios.post("/api/to/delete", toForm)
            .then((res) => {
                props.setEventForm({...props.eventForm, to: null});
                setDeleteDialogOpen(false);
                handleClose();
            });
    }

    return(
        <>
            <Box display={"flex"}>
                <Autocomplete
                    id="to-input"
                    sx={{m: "auto", width: 1}}
                    disabled={props.eventDialogMode === 'view'}
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
                    value={props.eventForm.to}
                    renderInput={(params) =>
                        <TextField {...params}
                            // required
                            // error={dialogValue.to === null}
                            // helperText={dialogValue.to === null ? 'Required' : ''}
                            //        margin="dense"
                                   label="TO"
                            // type="text"
                            // variant="standard"
                        />}
                />
                <IconButton sx={props.eventForm.to !== null ? {my: "auto", ml: 1} : {display: 'none'}} onClick={() => handleOpenToDetail(toIsEditable ? 'edit' : 'view')}>
                    {toIsEditable
                        ? <EditIcon />
                        : <VisibilityIcon />
                    }
                </IconButton>
            </Box>
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