import TextField from "@mui/material/TextField";

export const FormFields = (props) => {
    return(
        <>
            {props.fields.map((field) => (
                <TextField
                    key={field.id}
                    error={field.error !== null}
                    required
                    id={field.id}
                    label={field.label}
                    value={field.value}
                    name={field.id}
                    autoComplete={field.autoComplete}
                    onInput={e => props.handleChange(e)}
                    helperText={field.error}
                    type={field.type}
                    />
            ))}
        </>
    )
}