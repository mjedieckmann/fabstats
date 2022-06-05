/**
 * Scoreboard where matches are displayed.
 * Each row of the table is a match, clicking a match will open the match detail dialog.
 */
import {useState} from "react";
import {useRecoilState} from "recoil";
import PropTypes from 'prop-types';
import {Box, IconButton, Table, TableBody, TableContainer, TableCell, TableRow, Paper, TableFooter, TablePagination, TableHead, useTheme} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {filteredMatchesState, pageState} from "./ScoreboardContainer";
import MatchDetailDialog from "./match/MatchDetailDialog";
import {entityIsEditableByUser} from "../../../utils/_globalUtils";
import {currentUserState} from "../../../utils/_globalState";

/**
 * Handle pagination that is displayed in the bottom of the table.
 */
function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export default function Scoreboard() {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useRecoilState(pageState);
    const [filteredMatches,] = useRecoilState(filteredMatchesState);
    const [ currentUser, ] = useRecoilState(currentUserState);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper} variant={"opacity-0.9"}>
            <Table aria-label="collapsible table" size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Winner</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">Loser</TableCell>
                        <TableCell align="center">Event</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? filteredMatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : filteredMatches
                    ).map((row) => (
                        <MatchDetailDialog key={row._id} row={row} matchDialogMode={entityIsEditableByUser(row, currentUser) ? 'edit' : 'view'}/>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                            colSpan={5}
                            count={filteredMatches.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {
                                    'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
