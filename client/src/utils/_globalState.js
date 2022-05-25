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
    }, []);
}

export const currentUserState = atom( {
    key: 'currentUser',
    default: 0
})

export const dirtyState = atom( {
    key: 'dirty',
    default: uuid()
})

export const ROUNDS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Quarterfinal', 'Semifinal', 'Final', 'N/A'];
