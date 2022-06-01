import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {preventSubmitOnEnter} from "../../../utils/_globalUtils";

export const SimpleAutocomplete = (props) =>{
    return (
        <>
            <Autocomplete
                id={props.handle + "-input"}
                disabled={props.disabled}
                options={props.options}
                name={props.handle}
                onChange={(event, newValue) => {
                    props.setForm({...props.form, [props.handle]: newValue});
                }}
                isOptionEqualToValue={(option, value) => {
                    return option.id === value.id;
                }}
                value={props.form[props.handle]}
                renderInput={(params) => <TextField {...params} label={props.label} required={props.required} onKeyDown={preventSubmitOnEnter}/>}
            />
        </>
    )
}