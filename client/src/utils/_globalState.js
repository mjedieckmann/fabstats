import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";
import uuid from 'react-uuid'
import EclipseImage from '../img/Eclipse_Full_Art.width-10000.jpg';
import EnlightenmentImage from '../img/Seek_Enlightenment_Full_Art.width-10000.jpg';

export const currentPageState = atom({
    key: 'currentPage',
    default: 'Scoreboard',
});

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
        }
    }, [page]);
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

export const backgroundImgState = atom( {
    key: 'backgroundImg',
    default: null,
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