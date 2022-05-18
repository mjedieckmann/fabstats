import {useRecoilState} from "recoil";
import {nav_buttons} from "../pages/_pageUtils";
import {currentPageState} from "../../utils/_globalState";

export default function NavbarIcon() {
    const [currentPage, ] = useRecoilState(currentPageState);
    return nav_buttons.find((btn) => btn.name === currentPage).icon;
}