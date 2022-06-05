/**
 * User menu from which the user profile dialog can be opened and the user can log out.
 * Clicking on the user avatar will open the menu.
 */

import {useState} from "react";
import axios from "axios";
import uuid from "react-uuid";
import {useRecoilState} from "recoil";
import {Menu, MenuItem, Avatar, IconButton} from "@mui/material";
import {currentUserState, dirtyState} from "../../../../utils/_globalState";
import {useNotification} from "../../../../utils/_globalUtils";

export default function ProfileMenu (props) {
    const [ userMenuAnchor, setUserMenuAnchor ] = useState(null);
    const [ currentUser, ] = useRecoilState(currentUserState);
    const [ ,setDirty ] = useRecoilState(dirtyState);
    const userMenuOpen = Boolean(userMenuAnchor);
    const showNotification = useNotification();

    const handleMenuClick = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleProfileClick = () => {
        props.handleOpen();
        handleMenuClose();
    }

    const handleLogout = () => {
        axios.get("/users/logout")
            .then(res => {
                setDirty(uuid());
                showNotification(res.data.message);
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
                aria-controls={userMenuOpen ? 'authentication-menu' : undefined}
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
                    'aria-labelledby': 'authentication-menu-button',
                }}
            >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
}