import {Avatar, IconButton} from "@mui/material";
import {styled} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import {useRecoilState} from "recoil";
import {currentUserState, dirtyState} from "../../utils/_globalState";
import axios from "axios";
import uuid from "react-uuid";

const Input = styled('input')({
    display: 'none',
});

export default function ProfileDialog() {
    const [ currentUser, ] = useRecoilState(currentUserState);
    const [ ,setDirty ] = useRecoilState(dirtyState);

    const userAvatarUpload = (event) => {
        const data = new FormData()
        data.append('file', event.target.files[0])
        axios.post("/users/upload", data, {})
            .then(res => {
                setDirty(uuid());
                console.log(res);
            });
    }

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" onChange={userAvatarUpload}/>
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <Avatar alt={currentUser.nick} src={currentUser.img} sx={{ width: 156, height: 156 }} />
                </IconButton>
            </label>
        </Stack>
    );
}
