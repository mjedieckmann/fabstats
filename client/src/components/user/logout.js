import {useEffect, useState} from "react";

function Logout(props) {
    const [logout_message, setLogoutMessage] = useState('')

    useEffect(() => {
        fetch("/users/logout")
            .then(res => res.json())
            .then((logout_message) => {props.setLoggedIn(false); setLogoutMessage(logout_message.msg)})
    }, [])

    return (
        <div >
            <h2>Logout Message:</h2>
            <h1>{logout_message}</h1>
        </div>
    );
}

export default Logout;
