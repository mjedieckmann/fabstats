import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {loggedInState} from "../../utils/_globalState";

function Logout() {
    const [logout_message, setLogoutMessage] = useState('')
    const [, setLoggedIn] = useRecoilState(loggedInState);

    useEffect(() => {
        fetch("/users/logout")
            .then(res => res.json())
            .then((logout_message) => {setLoggedIn(false); setLogoutMessage(logout_message.msg)})
    }, [])

    return (
        <div >
            <h2>Logout Message:</h2>
            <h1>{logout_message}</h1>
        </div>
    );
}

export default Logout;
