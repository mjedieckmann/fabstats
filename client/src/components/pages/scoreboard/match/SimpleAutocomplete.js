/**
 * Wrapper for autocompletes that reduces boilerplate to set its properties.
 */

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {preventSubmitOnEnter} from "../../../../utils/_globalUtils";

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
                getOptionLabel={(option) => {
                    if (option.descriptor !== undefined){
                        return option.descriptor;
                    } else if (option.name !== undefined){
                        return option.name;
                    } else {
                        return null;
                    }
                }}
                isOptionEqualToValue={(option, value) => {
                    return option._id === value._id;
                }}
                value={props.form[props.handle]}
                renderInput={(params) => <TextField {...params} error={props.error} helperText={props.error ? 'Required' : ''} label={props.label} required={props.required} onKeyDown={preventSubmitOnEnter}/>}
            />
        </>
    )
}