import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {
    Avatar, Box, Button,
    CardActionArea, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider, Grid
} from '@mui/material';
import {useEffect, useState} from "react";
import {BarChart} from "./BarChart";

export default function HeroCard(props) {
    // state for winrate, state for filteredMatches
    const [ filteredMatches, setFilteredMatches ] = useState([]);
    useEffect(() => {
        setFilteredMatches(props.matches.filter((match) => ((props.hero._id === match.hero_winner._id) || (props.hero._id === match.hero_loser._id))));
    }, [props.matches])
    const [ winPercent, setWinPercent ] = useState(0);
    const [ wins, setWins ] = useState(0);
    const [ losses, setLosses ] = useState(0);
    useEffect(() => {
        setWins(filteredMatches.filter((match) => match.hero_winner.name === props.hero.name).length)
        setLosses(filteredMatches.filter((match) => match.hero_loser.name === props.hero.name).length)
        let total = wins + losses
        if (total === 0){
            setWinPercent(-1)
        } else {
            setWinPercent(Math.round((wins / total) * 100));
        }
    }, [filteredMatches])
    const [ heroDialogOpen, setHeroDialogOpen ] = useState(false);

    const handleClose = () => {
        setHeroDialogOpen(false);
    }

    const handleOpen = () => {
        setHeroDialogOpen(true);
    }
    return (
        <>
            <Card>
                <CardActionArea onClick={handleOpen}>
                    <CardMedia
                        top={0}
                        component="img"
                        image={props.hero.img}
                        sx={{height: 200, objectPosition: "top"}}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="subtitle2" component="div" textAlign={"center"}>
                            {props.hero.name}
                        </Typography>
                        <Divider/>
                        <Typography variant="subtitle1" color="text.secondary" textAlign={"center"}>
                            Wins: {wins} / {wins + losses} ({winPercent === -1 ? "N/A" : winPercent + " %"})
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog open={heroDialogOpen} onClose={handleClose} fullWidth={true} maxWidth={false}>
                <DialogTitle>
                    <Box>
                        <Avatar alt={props.hero.name} src={props.hero.img} sx={{ width: 156, height: 156 }} />
                        Hero Details
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={5}>
                            {/*<Avatar alt={props.hero.name} src={props.hero.img} sx={{ width: 156, height: 156 }} />*/}
                        </Grid>
                        <Grid item xs={7}>
                            <BarChart matches={filteredMatches} hero={props.hero}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
