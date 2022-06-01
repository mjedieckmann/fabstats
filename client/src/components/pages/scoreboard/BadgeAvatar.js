import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import {useEffect, useState} from "react";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
}));

export default function BadgeAvatars(props) {
    const [img, setImg] = useState(null);
    useEffect(() => {
        setImg(props.hero.img);
    }, [props.hero.img])
    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                props.user !== null
                    ? <SmallAvatar alt={props.user.nick} src={props.user.img} />
                    : <SmallAvatar/>
            }
        >
            <Avatar alt={props.hero.name} src={img} sx={props.winner ? {border: '2px solid green'} : {border: '2px solid red'}}/>
        </Badge>
    );
}