import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Avatar, IconButton} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import {useRecoilState} from "recoil";
import {currentUserState, dirtyState} from "../../utils/_globalState";
import {useState} from "react";
import axios from "axios";
import uuid from "react-uuid";

export default function BasicMenu (props) {
    const [ userMenuAnchor, setUserMenuAnchor ] = useState(null);
    const [ currentUser, ] = useRecoilState(currentUserState);
    const [ ,setDirty ] = useRecoilState(dirtyState);
    const userMenuOpen = Boolean(userMenuAnchor);

    const handleMenuClick = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleProfileClick = () => {
        props.handleOpen();
        handleMenuClose();
    }

    const handleLogout = () => {
        console.log('logging out');
        axios.get("/users/logout")
            .then(res => {
                setDirty(uuid());
                console.log(res);
                handleMenuClose();
            });
    }

    const handleMenuClose = () => {
        setUserMenuAnchor(null);
    };

    return (
        <>
            <IconButton
                id="user-menu-button"
                aria-controls={userMenuOpen ? 'user-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={userMenuOpen ? 'true' : undefined}
                onClick={handleMenuClick}
            >
                <Avatar src={currentUser.img}></Avatar>
            </IconButton>
            <Menu
                id="user-menu"
                anchorEl={userMenuAnchor}
                open={userMenuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'user-menu-button',
                }}
            >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
}