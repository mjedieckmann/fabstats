import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import PropTypes from "prop-types";
import {Avatar, Chip} from "@mui/material";
import BadgeAvatars from "./BadgeAvatar";
import MatchDialog from "./MatchDialog";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../../utils/_globalState";

export function Row(props) {
    const { row } = props;
    const [ currentUser, ] = useRecoilState(currentUserState);

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset'} }}>
                <TableCell align="center">{row.event !== null ? row.event.descriptor : '(none)'}</TableCell>
                <TableCell align="center">{row.event !== null ? row.event.event_type : '(none)'}</TableCell>
                <TableCell align="center">{row.round}</TableCell>
                <TableCell align="center">
                    <BadgeAvatars
                        hero_name={row.hero_winner.name} hero_img={row.hero_winner.img}
                        user_name={row.user_winner.nick} user_img={row.user_winner.img}/>
                </TableCell>
                <TableCell align="center">Vs.</TableCell>
                <TableCell align="center">
                    <BadgeAvatars
                        hero_name={row.hero_loser.name} hero_img={row.hero_loser.img}
                        user_name={row.user_loser.nick} user_img={row.user_loser.img}/>
                </TableCell>
                <TableCell align="center">{row.format.descriptor}</TableCell>
                <TableCell align="center">{row.meta.descriptor}</TableCell>
                <TableCell align="center">{row.event !== null && row.event.to != null ? row.event.to.descriptor : '(none)'}</TableCell>
                <TableCell align="center">{row.date_formatted}</TableCell>
                <TableCell align="center">
                    {
                        currentUser !== null &&
                        currentUser !== 0 &&
                        currentUser._id === row.created_by._id
                            ? <MatchDialog match_url={row.url} submitMode={'edit'}/>
                            : ''
                    }
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        event: PropTypes.object,
        round: PropTypes.string.isRequired,
        hero_winner: PropTypes.object.isRequired,
        hero_loser: PropTypes.object.isRequired,
        user_winner: PropTypes.object.isRequired,
        user_loser: PropTypes.object.isRequired,
        format: PropTypes.object.isRequired,
        meta: PropTypes.object.isRequired,
        notes: PropTypes.string,
        date_formatted: PropTypes.string.isRequired,
        created_by: PropTypes.object.isRequired,
    }).isRequired,
};