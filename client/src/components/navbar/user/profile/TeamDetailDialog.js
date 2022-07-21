/**
 * Handles viewing, creating, and editing teams.
 * To create a new team, the freeform autocomplete gives an option if the input does not match any existing team.
 * If the current user is the creator of the currently selected team, they can edit it by using the respective button.
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

export const TeamDetailDialog = (props) => {
    /* When the team detail dialog is closed, the list of teams needs to be reloaded from the database. */
    const [ teamsChanged, setTeamsChanged] = useState(uuid());
    const [ currentUser, ] = useRecoilState(currentUserState);
    let teamIsEditable = entityIsEditableByUser(props.userForm.team, currentUser);
    const [ teamDialogMode, setTeamDialogMode ] = useState('view');
    const showNotification = useNotification();

    const [ teams, setTeams ] = useState([]);
    useEffect(() => {
        axios.get('/users/teams')
            .then(res => {
                setTeams(res.data);
            })
            .catch(err => showNotification(err.response.data.message));
    }, [teamsChanged]);
    const [ teamForm, setTeamForm ] = useState({_id: null, nick: ''});
    const [ teamDialogOpen, setTeamDialogOpen ] = useState(false);

    const handleOpenTeamDetail = (mode) => {
        switch (mode){
            case 'create':
                props.setUserForm({
                    ...props.userForm,
                    team: null
                });
                break;
            case 'view':
            case 'edit':
                setTeamForm({
                    _id : props.userForm.team._id,
                    nick: props.userForm.team.nick
                })
                break;
            default:
                props.setUserForm({
                    ...props.userForm,
                    team: null
                });
        }
        setTeamDialogMode(mode);
        setTeamDialogOpen(true)
    }

    const handleClose = () => {
        props.setHasChanged(true);
        setTeamsChanged(uuid());
        setTeamDialogOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (teamDialogMode === 'view'){
            setTeamDialogOpen(false);
        } else {
            axios.post('/users/team/' + teamDialogMode, teamForm)
                .then(res => {
                    props.setUserForm({...props.userForm, team: res.data.team});
                    showNotification(res.data.message);
                    handleClose();
                })
                .catch(err => showNotification(err.response.data.message, 'error'));
        }
    }

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleDeleteTeam = () => {
        axios.post("/users/team/delete", teamForm)
            .then((res) => {
                props.setUserForm({...props.userForm, team: null});
                showNotification(res.data.message);
                setDeleteDialogOpen(false);
                handleClose();
            })
            .catch(err => showNotification(err.response.data.message, 'error'));
    }

    return(
        <>
            <Box display={"flex"}>
                {/* This autocomplete component is displayed in the user profile form. */}
                <Autocomplete
                    id="team-input"
                    sx={{m: "auto", width: 1}}
                     // Typing a new team and selecting "create [input]..." will open the team detail dialog in "create" mode.
                    onChange={(e, newValue) => {
                        if (typeof newValue === 'string') {
                            // timeout to avoid instant validation of the dialog's form.
                            setTimeout(() => {
                                setTeamForm({
                                    _id: null,
                                    nick: newValue.nick
                                });
                                handleOpenTeamDetail('create');
                            });
                        } else if (newValue && newValue.inputValue) {
                            setTeamForm({
                                _id: null,
                                nick: newValue.inputValue
                            });
                            handleOpenTeamDetail('create');
                        } else {
                            props.setUserForm({
                                ...props.userForm,
                                team: newValue
                            });
                        }
                    }}
                     // Makes the autocomplete display the "create [input]..." option depending on the user input.
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);
                        if (params.inputValue !== '' && !filtered.some(e => e.nick === params.inputValue)) {
                            filtered.push({
                                inputValue: `${params.inputValue} `,
                                nick: `create "${params.inputValue}"`,
                            });
                        }
                        return filtered;
                    }}
                    options={teams}
                     // We are working with objects. This ensures that the right property gets displayed.
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') {
                            return option;
                        }
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        return option.nick;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                     // We are working with objects. This ensures that the right property gets displayed.
                    renderOption={(props, option) => <li {...props}>{option.nick}</li>}
                    freeSolo
                     // We are working with objects. This ensures that the right property is used for comparison.
                    isOptionEqualToValue={(option, value) => {
                        return option._id === value._id;
                    }}
                    value={props.userForm.team}
                    renderInput={(params) =>
                        <TextField {...params} label="Team" />}
                />
                {/* Display the edit or view icon, depending on whether the user is the creator of the team.
                Clicking the button will open the team detail dialog.
                Only displays an icon if a team is selected. */}
                <IconButton sx={props.userForm.team !== null ? {my: "auto", ml: 1} : {display: 'none'}} onClick={() => handleOpenTeamDetail(teamIsEditable ? 'edit' : 'view')}>
                    {teamIsEditable
                        ? <EditIcon />
                        : <VisibilityIcon />
                    }
                </IconButton>
            </Box>
            {/* Team detail dialog to edit or delete an existing team. */}
            <Dialog open={teamDialogOpen} onClose={() => setTeamDialogOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>
                        {capitalizeFirstLetter(teamDialogMode) + " Team" }
                        <DeleteConfirmationDialog
                            sx={teamDialogMode === 'edit' ? {} : {display: 'none'}}
                            deleteDialogOpen={deleteDialogOpen}
                            setDeleteDialogOpen={setDeleteDialogOpen}
                            handleDelete={handleDeleteTeam}
                            entity={'team'}
                        />
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            error={teamForm.nick === ''}
                            helperText={teamForm.nick === '' ? 'Required' : ''}
                            disabled={teamDialogMode === 'view'}
                            margin="dense"
                            id="team-input"
                            value={teamForm.nick}
                            onChange={(event) =>
                                setTeamForm({
                                    ...teamForm,
                                    nick: event.target.value,
                                })
                            }
                            label="Team name"
                            type="text"
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button sx={teamDialogMode !== 'view' ? {} : {display: 'none'}} onClick={() => setTeamDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">OK</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    )
}