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
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import {capitalizeFirstLetter, entityIsEditableByUser, useNotification} from "../../utils/_globalUtils";
import DeleteConfirmationDialog from "../pages/scoreboard/DeleteConfirmationDialog";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../utils/_globalState";
import VisibilityIcon from "@mui/icons-material/Visibility";

const filter = createFilterOptions();

export const TeamDetailDialog = (props) => {
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
                <Autocomplete
                    id="team-input"
                    sx={{m: "auto", width: 1}}
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
                    getOptionLabel={(option) => {
                        // e.g value selected with enter, right from the input
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
                    renderOption={(props, option) => <li {...props}>{option.nick}</li>}
                    freeSolo
                    isOptionEqualToValue={(option, value) => {
                        return option._id === value._id;
                    }}
                    value={props.userForm.team}
                    renderInput={(params) =>
                        <TextField {...params} label="Team" />}
                />
                <IconButton sx={props.userForm.team !== null ? {my: "auto", ml: 1} : {display: 'none'}} onClick={() => handleOpenTeamDetail(teamIsEditable ? 'edit' : 'view')}>
                    {teamIsEditable
                        ? <EditIcon />
                        : <VisibilityIcon />
                    }
                </IconButton>
            </Box>
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