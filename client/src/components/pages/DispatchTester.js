import {AboutDispatch} from "./About";
import {useContext} from "react";
import Button from "@mui/material/Button";
import {DeeperComponentBleh} from "./DeeperComponentBleh";

export const DispatchTester = () => {
    const [blub, setBlub] = useContext(AboutDispatch);

    function handleClick() {
        setBlub('BLUB');
    }

    return (
        <>
            {blub}
            <Button onClick={handleClick}>Do a click</Button>
            <DeeperComponentBleh/>
        </>
    );
}