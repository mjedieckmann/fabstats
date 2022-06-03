import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import uuid from 'react-uuid'

export const currentPageState = atom({
    key: 'currentPage',
    default: 'Scoreboard',
});

export function useCurrentPage(page){
    const [, setCurrentPage] = useRecoilState(currentPageState);
    useEffect(() => {
        setCurrentPage(page);
    }, [page, setCurrentPage]);
}

export const currentUserState = atom( {
    key: 'currentUser',
    default: 0
})

export const dirtyState = atom( {
    key: 'dirty',
    default: uuid()
})

export const tosChangedState = atom( {
    key: 'tosChanged',
    default: uuid()
})

export const eventsChangedState = atom( {
    key: 'eventsChanged',
    default: uuid()
})


export const ROUNDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A'];

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

export const contactDialogState = atom({
    key: 'contactDialogOpen',
    default: false
})

export const notificationState = atom({
    key: 'notification',
    default: []
})

export const notificationTypeState = atom({
    key: 'notificationType',
    default: 'success'
})