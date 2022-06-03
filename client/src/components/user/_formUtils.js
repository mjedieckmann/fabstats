import {useEffect, useState} from "react";
import {atom, useRecoilState} from "recoil";
import {currentUserState} from "../../utils/_globalState";
import axios from "axios";
import {useNotification} from "../../utils/_globalUtils";

export const dialogOpenState = atom({
    key: 'open',
    default: false,
});

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

const notEmpty = (label, field) => {
    return booleanPromise(field.length !== 0, label + ' is required!');
}

const hasLength = (label, field, minLength, maxLength) => {
    return booleanPromise(field.length >= minLength && field.length <= maxLength, label + ' length (' + minLength + ' - ' + maxLength + ')');
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

const useAuthenticationForm = (form_state, error_state) => {
    const [form, formError, setFormError, handleChange] = useForm(form_state, error_state);

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            username: null
        }));
    }, [form.username, setFormError])

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            e_mail: null
        }));
    }, [form.e_mail, setFormError])

    return [
        form,
        formError,
        setFormError,
        handleChange,
    ]
}

export const useForm = (form_state, error_state) => {
    const [ form, setForm ] = useState(form_state);
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
        handleChange,
    ]
}

export const useLoginForm = (form_state, error_state) => {
    const [form, formError, setFormError, handleChange] = useAuthenticationForm(form_state, error_state);
    const [, setOpen] = useRecoilState(dialogOpenState);
    const [, setCurrentUser] = useRecoilState(currentUserState);
    const showNotification = useNotification();

    const loginUser = () => {
        validateForm().then(() => {
            axios.post("/users/login", form)
                .then((res) => {
                    setCurrentUser(res.data.user);
                    showNotification('Logged in!');
                    setOpen(false);
                })
                .catch((res) => {
                    showNotification(res.response.data.message, 'error');
                });
            }, (reason) => showNotification(reason, 'error')
        );
    }

    const validateForm = () => {
        const userValid = notEmpty('Username', form.username)
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    username: rejected,
                }));
                return Promise.reject(rejected);
            });
        const passwordValid = notEmpty('Password', form.password)
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    password: rejected,
                }));
                return Promise.reject(rejected);
            });
        return Promise.all([userValid, passwordValid]);
    }

    return [
        {
            handleChange: handleChange,
            loginUser: loginUser,
            LOGIN_FIELDS: LOGIN_FIELDS(form, formError),
        }
    ]
}

export const useRegisterForm = (form_state, error_state, setTab) => {
    const [form, formError, setFormError, handleChange] = useAuthenticationForm(form_state, error_state);
    const showNotification = useNotification();

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            e_mail: null
        }));
    }, [form.e_mail, setFormError])

    useEffect(() =>{
        setFormError(prevState => ({
            ...prevState,
            password: null
        }));
    }, [form.password, setFormError])

    const registerUser = () => {
        validateForm().then(() => {
                axios.post("/users/register", form)
                    .then((res) => {
                        showNotification(res.data.message)
                        setTab('1');
                    })
                    .catch((res) => {
                        showNotification(res.response.data.message, 'error');
                    });
            }, (reason) => showNotification(reason, 'error')
        );
    }

    const validateForm = () => {
        setFormError(error_state);
        const userValid = notEmpty('Username', form.username)
            .then(() => hasLength('Username', form.username, 4, 20))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    username: rejected,
                }));
                return Promise.reject(rejected);
            });
        const emailValid = notEmpty('E-Mail', form.e_mail)
            .then(() => isEMail(form.e_mail))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    e_mail: rejected,
                }));
                return Promise.reject(rejected);
            });
        const passwordValid = notEmpty('Password', form.password)
            .then(() => hasLength('Password', form.password, 8, 20))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    password: rejected,
                }));
                return Promise.reject(rejected);
            });
        const passwordRepeatValid = notEmpty('Password (repeat)', form.password_repeat)
            .then(() => fieldsEqual(form.password, form.password_repeat))
            .catch((rejected) => {
                setFormError(prevState => ({
                    ...prevState,
                    password_repeat: rejected,
                }));
                return Promise.reject(rejected);
            });
        return Promise.all([userValid, emailValid, passwordValid, passwordRepeatValid]);
    }

    return [
        {
            handleChange: handleChange,
            registerUser: registerUser,
            REGISTER_FIELDS: REGISTER_FIELDS(form, formError)
        }
    ]
}