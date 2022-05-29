import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import {useState} from "react";
import {eventsState, useSimpleDataFetch} from "../_pageUtils";
import axios from "axios";
import {useRecoilState} from "recoil";
import {EVENT_TYPES} from "../../../utils/_globalState";


const filter = createFilterOptions();

export default function EventAutocomplete(props) {
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        descriptor: '',
        event_type: '',
        to: '',
    });
    const [tos, setTos] = useState([]);
    useSimpleDataFetch(setTos, 'api/tos', 'descriptor');
    const [events, setEvents] = useRecoilState(eventsState);

    const handleClose = () => {
        setDialogValue({
            descriptor: '',
            event_type: '',
            to: '',
        });

        toggleOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        axios.post("/api/event/create", dialogValue)
            .then((res) => {
                setEvents(events => [...events, res.data]);
                props.setForm({...props.form, event: res.data});
            });
        handleClose();
    };

    return (
        <>
            <Autocomplete
                onChange={(e, newValue) => {
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            toggleOpen(true);
                            setDialogValue({
                                descriptor: newValue.descriptor,
                                event_type: '',
                                to: '',
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            descriptor: newValue.inputValue,
                            event_type: '',
                            to: '',
                        });
                    } else {
                        props.setForm({...props.form, event: newValue});
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue !== '' && !filtered.some(e => e.descriptor === params.inputValue)) {
                        filtered.push({
                            inputValue: `${params.inputValue} `,
                            descriptor: `Add "${params.inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                id="event-autocomplete"
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
                sx={{ width: 300 }}
                freeSolo
                isOptionEqualToValue={(option, value) => {
                    return option._id === value._id;
                }}
                value={props.form.event}
                renderInput={(params) => <TextField {...params} label="Event" />}
            />
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add a new Event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Did you miss any event in our list? Please, add it!
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="event-input"
                            value={dialogValue.descriptor}
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    descriptor: event.target.value,
                                })
                            }
                            label="Event name"
                            type="text"
                            variant="standard"
                        />
                        <Autocomplete
                            id="event-type-input"
                            options={EVENT_TYPES}
                            onChange={(event, newValue) =>
                                setDialogValue({
                                    ...dialogValue,
                                    event_type: newValue,
                                })
                            }
                            renderInput={(params) =>
                                <TextField {...params}
                                           required
                                           error={dialogValue.event_type === null}
                                           helperText={dialogValue.event_type === null ? 'Required' : ''}
                                           margin="dense"
                                           label="Event Type"
                                           type="text"
                                           variant="standard"
                                />}
                        />
                        <Autocomplete
                            id="to-input"
                            freeSolo
                            options={tos}
                            value={dialogValue.to}
                            onInputChange={(event, newInput) => {
                                setDialogValue({
                                    ...dialogValue,
                                    to: newInput,
                                });
                            }}
                            renderInput={(params) =>
                                <TextField {...params}
                                           required
                                           error={dialogValue.to === null}
                                           helperText={dialogValue.to === null ? 'Required' : ''}
                                           margin="dense"
                                           label="TO"
                                           type="text"
                                           variant="standard"
                                />}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}