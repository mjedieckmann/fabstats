/**
 * Display hero and user together in a combined avatar.
 */

import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import {useEffect, useState} from "react";
import {Tooltip} from "@mui/material";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
}));

export default function BadgeAvatars(props) {
    const [img, setImg] = useState(null);
    const [ heroTooltipOpen, setHeroTooltipOpen ] = useState(false);
    const [ userTooltipOpen, setUserTooltipOpen ] = useState(false);
    useEffect(() => {
        setImg(props.hero.img);
    }, [props.hero.img])

    const handleHeroTooltipClose = () => {
        setHeroTooltipOpen(false);
    }

    const handleUserTooltipClose = () => {
        if (heroTooltipOpen){
            setHeroTooltipOpen(false);
        }
        setUserTooltipOpen(false);
    }

    return (
        <Tooltip title={props.hero.name} arrow open={!userTooltipOpen && heroTooltipOpen} onOpen={() => setHeroTooltipOpen(true)} onClose={handleHeroTooltipClose}>
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                    props.user !== null
                        ? <Tooltip title={props.user.nick} arrow open={userTooltipOpen} onOpen={() => setUserTooltipOpen(true)} onClose={handleUserTooltipClose}><SmallAvatar alt={props.user.nick} src={props.user.img} /></Tooltip>
                        : <SmallAvatar/>
                }
            >
                <Avatar alt={props.hero.name} src={img} sx={props.winner ? {border: '2px solid green'} : {border: '2px solid red'}}/>
            </Badge>
        </Tooltip>
    );
}