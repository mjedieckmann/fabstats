/**
 * Defines variables and states that are available everywhere in the application.
 */

import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import uuid from 'react-uuid'
import EclipseImage from '../img/sm_Eclipse.jpg';
import EnlightenmentImage from '../img/sm_Seek_Enlightenment.jpg';
import ExudeImage from '../img/sm_exude.jpg';

/**
 * The currently active page
 */
export const currentPageState = atom({
    key: 'currentPage',
    default: 'Scoreboard',
});

/**
 * Hook to set the currently active page.
 */
export function useCurrentPage(page){
    const [ ,setBackgroundImg ] = useRecoilState(backgroundImgState);
    useEffect(() => {
        switch (page){
            case 'About':
                setBackgroundImg(EclipseImage);
                break;
            case 'Scoreboard':
                setBackgroundImg(EnlightenmentImage);
                break;
            case 'Heroes':
                setBackgroundImg(ExudeImage);
                break;
            default:
                setBackgroundImg(EclipseImage);
        }
    }, [page, setBackgroundImg]);
    const [, setCurrentPage] = useRecoilState(currentPageState);
    useEffect(() => {
        setCurrentPage(page);
    }, [page, setCurrentPage]);
}

/**
 * The currently logged-in authentication.
 */
export const currentUserState = atom( {
    key: 'currentUser',
    default: 0
})

/**
 * When we make changes to the database, we want the affected states to reflect that change.
 * We achieve this by triggering the hooks that fill the affected states to reload the data from the database.
 * Changing the "dirty" will trigger these hooks.
 */
export const dirtyState = atom( {
    key: 'dirty',
    default: uuid()
})

/**
 * The background image that is displayed on the page.
 */
export const backgroundImgState = atom( {
    key: 'backgroundImg',
    default: null,
})

/**
 * The round of an event that a match took place in.
 */
export const ROUNDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A'];

/**
 * The possible types of an event.
 */
export const EVENT_TYPES = [
    'On Demand',
    'Armory',
    'Skirmish',
    'Road to Nationals',
    'ProQuest',
    'Battle Hardened',
    'Calling',
    'Nationals',
    'Pro Tour',
    'Farewell Welcome to Rathe',
    'Pre-release',
    'World Championship',
];

/**
 * Whether the "Contact" dialog is open.
 */
export const contactDialogState = atom({
    key: 'contactDialogOpen',
    default: false
})

/**
 * To display a notification to the authentication in the form of a snackbar component.
 */
export const notificationState = atom({
    key: 'notification',
    default: []
})

/**
 * Whether the notification is an error or a positive feedback.
 */
export const notificationTypeState = atom({
    key: 'notificationType',
    default: 'success'
})