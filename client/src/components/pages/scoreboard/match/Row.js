/**
 * A row of the scoreboard table that represents a single match.
 */

import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import PropTypes from "prop-types";
import BadgeAvatars from "./BadgeAvatar";

export function Row(props) {
    const { row } = props;

    return (
        <>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset', cursor: 'pointer'} }} onClick={props.handleOpen}>
                <TableCell align="center">{row.date_formatted}</TableCell>
                <TableCell align="center">
                    <BadgeAvatars hero={row.hero_winner} user={row.user_winner} winner={true}/>
                </TableCell>
                <TableCell align="center">Vs.</TableCell>
                <TableCell align="center">
                    <BadgeAvatars hero={row.hero_loser} user={row.user_loser} winner={false}/>
                </TableCell>
                <TableCell align="center">{row.event !== null ? row.event.descriptor : '(none)'}</TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        event: PropTypes.object,
        hero_winner: PropTypes.object.isRequired,
        hero_loser: PropTypes.object.isRequired,
        user_winner: PropTypes.object,
        user_loser: PropTypes.object,
        date_formatted: PropTypes.string.isRequired,
    }).isRequired,
};