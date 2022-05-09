import {useRecoilState} from "recoil";
import {currentPageState, nav_buttons} from "../pages/_pageUtils";

export default function NavbarIcon() {
    const [currentPage, ] = useRecoilState(currentPageState);
    return nav_buttons.find((btn) => btn.name === currentPage).icon;
}