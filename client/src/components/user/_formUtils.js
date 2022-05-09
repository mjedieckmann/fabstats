import {useEffect, useState} from "react";
import {atom, useRecoilState} from "recoil";

export const dialogOpenState = atom({
    key: 'open',
    default: false,
});

export function useCurrentPage(open){
    const [, setOpen] = useRecoilState(dialogOpenState);
    useEffect(() => {
        setOpen(open);
    }, []);
}

const FIELD_USER = (form, formError) => {
    return {
        id : "username",
        label: "Username",
        value: form.username,
        error: formError.username,
        autoComplete: "username",
        type: "text"
    }
}

const FIELD_EMAIL = (form, formError) => {
    return {
        id: "e_mail",
        label: "E-Mail",
        value: form.e_mail,
        error: formError.e_mail,
        autoComplete: "username",
        type: "email"
    }
}

const FIELD_PASSWORD = (form, formError) => {
    return {
        id : "password",
        label: "Password",
        value: form.password,
        error: formError.password,
        autoComplete: "new-password",
        type: "password"
    }
}

const FIELD_PASSWORD_REPEAT = (form, formError) => {
    return {
        id: "password_repeat",
        label: "Password (repeat)",
        value: form.password_repeat,
        error: formError.password_repeat,
        autoComplete: "new-password",
        type: "password"
    }
}

const LOGIN_FIELDS = (form, formError) => {
    return [
        FIELD_USER(form, formError),
        FIELD_PASSWORD(form, formError)
    ]
}


const REGISTER_FIELDS = (form, formError) => {
    return [
        FIELD_USER(form, formError),
        FIELD_EMAIL(form, formError),
        FIELD_PASSWORD(form, formError),
        FIELD_PASSWORD_REPEAT(form, formError)
    ]
}

const notEmpty = (field) => {
    return booleanPromise(field.length !== 0, 'Required');
}

const hasLength = (field, length) => {
    return booleanPromise(field.length >= length, 'Too short (min: ' + length + ')');
}

const isEMail = (field) => {
    return booleanPromise(field.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ), 'Invalid e-Mail.')
}

const fieldsEqual = (field1, field2) => {
    return booleanPromise(field1 === field2, 'Passwords don\'t match');
}

const booleanPromise = (boolean, message) => {
    return boolean ? Promise.resolve() : Promise.reject(message);
}

const useForm = (form_state, error_state) => {
    const [ form, setForm ] = useState(form_state);
    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            username: null
        }));
    }, [form.username])

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            e_mail: null
        }));
    }, [form.e_mail])

    const [ formError, setFormError ] = useState(error_state);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    return [
        form,
        formError,
        setFormError,
        handleChange
    ]
}

export const useLoginForm = (form_state, error_state) => {
    const [form, formError, setFormError, handleChange] = useForm(form_state, error_state);

    const validateForm = () => {
        const userValid = notEmpty(form.username)
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    username: rejected,
                }));
                return Promise.reject();
            });
        const passwordValid = notEmpty(form.password)
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    password: rejected,
                }));
                return Promise.reject();
            });
        return Promise.all([userValid, passwordValid]);
    }

    return [
        {
            handleChange: handleChange,
            validateForm: validateForm,
            LOGIN_FIELDS: LOGIN_FIELDS(form, formError)
        }
    ]
}

export const useRegisterForm = (form_state, error_state) => {
    const [form, formError, setFormError, handleChange] = useForm(form_state, error_state);

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            e_mail: null
        }));
    }, [form.e_mail])

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            password: null
        }));
    }, [form.password])

    const validateForm = () => {
        const userValid = notEmpty(form.username)
            .then(() => hasLength(form.username, 3))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    username: rejected,
                }));
                return Promise.reject();
            });
        const emailValid = notEmpty(form.e_mail)
            .then(() => isEMail(form.e_mail))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    e_mail: rejected,
                }));
                return Promise.reject();
            });
        const passwordValid = notEmpty(form.password)
            .then(() => hasLength(form.password, 5))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    password: rejected,
                }));
                return Promise.reject();
            });
        const passwordRepeatValid = notEmpty(form.password_repeat)
            .then(() => fieldsEqual(form.password, form.password_repeat))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    password_repeat: rejected,
                }));
                return Promise.reject();
            });
        return Promise.all([userValid, emailValid, passwordValid, passwordRepeatValid]);
    }

    return [
        {
            handleChange: handleChange,
            validateForm: validateForm,
            REGISTER_FIELDS: REGISTER_FIELDS(form, formError)
        }
    ]
}