/**
 * Static contact dialog that can be opened from the footer and the about page.
 */

import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Stack} from "@mui/material";
import {useRecoilState} from "recoil";
import {contactDialogState} from "../../utils/_globalState";

export default function ContactDialog() {
    const [contactDialogOpen, setContactDialogOpen] = useRecoilState(contactDialogState);

    const handleContactDialogOpen = () => {
        setContactDialogOpen(true);
    };

    const handleContactDialogClose = () => {
        setContactDialogOpen(false);
    };

    return (
        <>
            <Button aria-label="contact" onClick={handleContactDialogOpen}>
                Contact
            </Button>
            <Dialog
                open={contactDialogOpen}
                onClose={handleContactDialogClose}
                aria-labelledby="contact-dialog-title"
                aria-describedby="contact-dialog-content"
            >
                <DialogTitle variant="h6" fontWeight={"bold"} textAlign={"center"} id="contact-dialog-title">
                    Contact
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="contact-dialog-content">
                        <Stack textAlign={"center"}>
                            <Typography variant="overline">
                                Max Dieckmann
                            </Typography>
                            <Typography variant="overline">
                                Carrer Montanyans 10, 3-1
                            </Typography>
                            <Typography variant="overline">
                                08003, Barcelona, Spain
                            </Typography>
                            <Typography variant="caption">
                                <a href="mailto:info.fabstats@gmail.com" target="_top">info.fabstats@gmail.com</a>
                            </Typography>
                        </Stack>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleContactDialogClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
