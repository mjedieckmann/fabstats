import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import PropTypes from "prop-types";
import BadgeAvatars from "./BadgeAvatar";
import MatchDialog from "./MatchDialog";
import {useRecoilState} from "recoil";
import {currentUserState} from "../../../utils/_globalState";

export function Row(props) {
    const { row } = props;
    const [ currentUser, ] = useRecoilState(currentUserState);

    return (
        <>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset'} }}>
                <TableCell align="center">{row.event !== null ? row.event.descriptor : '(none)'}</TableCell>
                <TableCell align="center">{row.event !== null ? row.event.event_type : '(none)'}</TableCell>
                <TableCell align="center">{row.round}</TableCell>
                <TableCell align="center">
                    <BadgeAvatars hero={row.hero_winner} user={row.user_winner}/>
                </TableCell>
                <TableCell align="center">Vs.</TableCell>
                <TableCell align="center">
                    <BadgeAvatars hero={row.hero_loser} user={row.user_loser}/>
                </TableCell>
                <TableCell align="center">{row.format.descriptor}</TableCell>
                <TableCell align="center">{row.meta.descriptor}</TableCell>
                <TableCell align="center">{row.event !== null && row.event.to != null ? row.event.to.descriptor : '(none)'}</TableCell>
                <TableCell align="center">{row.date_formatted}</TableCell>
                <TableCell align="center">
                    {
                        currentUser !== null &&
                        currentUser !== 0 &&
                        row.created_by != null &&
                        currentUser._id === row.created_by._id
                            ? <MatchDialog match_url={row.url} submitMode={'edit'}/>
                            : ''
                    }
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        event: PropTypes.object,
        round: PropTypes.string.isRequired,
        hero_winner: PropTypes.object.isRequired,
        hero_loser: PropTypes.object.isRequired,
        user_winner: PropTypes.object,
        user_loser: PropTypes.object,
        format: PropTypes.object.isRequired,
        meta: PropTypes.object.isRequired,
        notes: PropTypes.string,
        date_formatted: PropTypes.string.isRequired,
        created_by: PropTypes.object,
    }).isRequired,
};