import {useEffect, useState} from "react";

function Protected(){
    const [protected_message, setProtectedMessage] = useState('')

    useEffect(() => {
        fetch("/users/protected-route")
            .then(res => res.json())
            .then((protected_message) => setProtectedMessage(protected_message.msg))
    }, [])

    return (
        <div >
            <h2>Protected Message:</h2>
            <h1>{protected_message}</h1>
        </div>
    );
}

export default Protected;
