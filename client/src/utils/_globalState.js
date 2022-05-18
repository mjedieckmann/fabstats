import {atom, useRecoilState} from "recoil";
import {useEffect} from "react";

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

export const loggedInState = atom({
    key: 'loggedIn',
    default: false,
});