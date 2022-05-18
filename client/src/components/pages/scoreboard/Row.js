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

export function Row(props) {
    const { row } = props;

    return (
        <React.Fragment>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset'} }}>
                <TableCell align="center">{row.event.descriptor}</TableCell>
                <TableCell align="center">{row.event.type}</TableCell>
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
                <TableCell align="center">{row.event.meta.descriptor}</TableCell>
                <TableCell align="center">{row.event.to.descriptor}</TableCell>
                <TableCell align="center">{row.event.date_formatted}</TableCell>
                <TableCell align="center"></TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        event: PropTypes.object.isRequired,
        round: PropTypes.string.isRequired,
        hero_winner: PropTypes.object.isRequired,
        hero_loser: PropTypes.object.isRequired,
        user_winner: PropTypes.object.isRequired,
        user_loser: PropTypes.object.isRequired,
        format: PropTypes.object.isRequired,
        notes: PropTypes.string
    }).isRequired,
};