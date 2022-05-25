import Dialog from '@mui/material/Dialog';
import AddIcon from "@mui/icons-material/Add";
import {Fab, IconButton} from "@mui/material";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import RegisterDialog from "../../user/RegisterDialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {FormFields} from "../../user/FormFields";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useForm} from "../../user/_formUtils";
import {useRecoilState} from "recoil";
import {eventsState, heroesState} from "../_pageUtils";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {DesktopDatePicker, LocalizationProvider} from "@mui/lab";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EventAutocomplete from "./EventAutocomplete";
import axios from "axios";
import {SimpleAutocomplete} from "./SimpleAutocomplete";
import {matchesState} from "./ScoreboardContainer";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import uuid from "react-uuid";
import {dirtyState} from "../../../utils/_globalState";

const ROUNDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A'];
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
    meta: null
}

export default function MatchDialog(props) {
    const [ open, setOpen ] = useState(false);
    const [ form, setForm ] = useState(EMPTY_FORM);
    const [ formError, setFormError ] = useState(EMPTY_FORM);
    const [ heroes, setHeroes ] = useState([]);
    const [ ,setDirty] = useRecoilState(dirtyState);
    useEffect(() =>{
        axios.get('/api/heroes')
            .then(res => {
                let heroes = new Set();
                res.data.map(hero => {
                    heroes.add({label: hero.name, id: hero._id});
                })
                setHeroes([...heroes]);
            });
    }, []);
    const [ users, setUsers ] = useState([]);
    useEffect(() =>{
        axios.get('/users')
            .then(res => {
                let users = new Set();
                res.data.map(user => {
                    users.add({label: user.nick, id: user._id});
                })
                setUsers([...users]);
            });
    }, []);
    const [ formats, setFormats ] = useState([]);
    useEffect(() =>{
        axios.get('/api/formats')
            .then(res => {
                let formats = new Set();
                res.data.map(format => {
                    formats.add({label: format.descriptor, id: format._id});
                })
                setFormats([...formats]);
            });
    }, []);
    const [ metas, setMetas ] = useState([]);
    useEffect(() =>{
        axios.get('/api/metas')
            .then(res => {
                let metas = new Set();
                res.data.map(meta => {
                    metas.add({label: meta.descriptor, id: meta._id});
                })
                setMetas([...metas]);
            });
    }, []);

    const handleOpen = () => {
        if (props.match_url){
            axios.get(props.match_url)
                .then(res => {
                    setForm({
                        _id : res.data._id,
                        date: res.data.date,
                        event: res.data.event,
                        round: res.data.round,
                        hero_winner: {label: res.data.hero_winner.name, id: res.data.hero_winner._id},
                        hero_loser: {label: res.data.hero_loser.name, id: res.data.hero_loser._id},
                        user_winner: res.data.user_winner !== null ? {label: res.data.user_winner.nick, id: res.data.user_winner._id} : null,
                        user_loser: res.data.user_loser !== null ? {label: res.data.user_loser.nick, id: res.data.user_loser._id} : null,
                        format: {label: res.data.format.descriptor, id: res.data.format._id},
                        meta: {label: res.data.meta.descriptor, id: res.data.meta._id},
                    });
                    setOpen(true);
                });
        } else {
            setForm(EMPTY_FORM);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [ matches, setMatches ] = useRecoilState(matchesState);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/api/match/" + props.submitMode, form)
            .then(res => {
                console.log(res);
                setDirty(uuid());
            })
            .catch((err) => {
                //TODO: Better error handling, especially with axios, which seems to dislike me.
                console.log(err);
            });
    }

    const handleDelete = () => {
        axios.post("/api/match/delete", form)
            .then((res) => {
                console.log('deleted', res);
                setDirty(new uuid());
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            {props.submitMode === 'edit' ?
            <IconButton aria-label="edit" onClick={handleOpen}>
                <EditIcon />
            </IconButton>
                :
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
                <AddIcon />
            </Fab>
            }
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'sm'}>
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <Box noValidate component="form" onSubmit={handleSubmit}>
                        <DialogTitle>
                            Match
                            {props.submitMode === 'edit'
                                ? <IconButton aria-label="edit" onClick={handleDelete}><DeleteIcon/></IconButton>
                                : ""
                            }
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Create / edit match:
                            </DialogContentText>
                            <Box sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}}>
                                {/*Date*/}
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="Date"
                                        value={form.date}
                                        minDate={new Date('2017-01-01')}
                                        onChange={(newValue) => {
                                            console.log(newValue)
                                            setForm({...form, date: newValue});
                                        }}
                                        renderInput={(params) => <TextField {...params} error={false} required />}
                                    />
                                </LocalizationProvider>
                                {/*Free-solo with dialog*/}
                                <EventAutocomplete setForm={setForm} form={form}/>
                                {/*Select only*/}
                                <Autocomplete
                                    id={"round-input"}
                                    options={ROUNDS}
                                    sx={{color:"red"}}
                                    name={"round"}
                                    onChange={(event, newValue) => {
                                        setForm({...form, round : newValue});
                                    }}
                                    value={form.round}
                                    renderInput={(params) => <TextField {...params} label={"Round"} required/>}
                                />
                                <SimpleAutocomplete handle="hero_winner" options={heroes} label="Hero (winner)" form={form} setForm={setForm}/>
                                <SimpleAutocomplete handle="hero_loser" options={heroes} label="Hero (loser)" form={form} setForm={setForm}/>
                                <SimpleAutocomplete handle="user_winner" options={users} label="Player (winner)" form={form} setForm={setForm}/>
                                <SimpleAutocomplete handle="user_loser" options={users} label="Player (loser)" form={form} setForm={setForm}/>
                                <SimpleAutocomplete handle="format" options={formats} label="Format" form={form} setForm={setForm}/>
                                <SimpleAutocomplete handle="meta" options={metas} label="Meta" form={form} setForm={setForm}/>
                                {/*(Notes)*/}
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpen(false)}>Cancel</Button>
                            <Button color={"success"} type={"submit"}>Create</Button>
                        </DialogActions>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
}
