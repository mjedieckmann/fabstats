import {AboutDispatch} from "./about/About";
import {useContext} from "react";
import Button from "@mui/material/Button";

export const DeeperComponentBleh = () => {
    const [blub, setBlub] = useContext(AboutDispatch);

    function handleClick() {
        setBlub('BLUB');
    }

    return (
        <>
            {blub}
            <Button onClick={handleClick}>tiefer blick</Button>

        </>
    );
}