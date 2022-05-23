import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import {currentUserState, loggedInState} from "../../utils/_globalState";

function Logout() {
    const [logout_message, setLogoutMessage] = useState('')
    const [, setCurrentUser] = useRecoilState(currentUserState);

    useEffect(() => {
        fetch("/users/logout")
            .then(res => res.json())
            .then((logout_message) => {setCurrentUser(null); setLogoutMessage(logout_message.message);})
    }, [])

    return (
        <div >
            <h2>Logout Message:</h2>
            <h1>{logout_message}</h1>
        </div>
    );
}

export default Logout;
