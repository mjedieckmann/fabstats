/**
 * Icon that is displayed in the navbar. Changes based on current page.
 */

import {useRecoilState} from "recoil";
import {nav_buttons} from "./_navbarUtils";
import {currentPageState} from "../../utils/_globalState";

export default function NavbarIcon() {
    const [currentPage, ] = useRecoilState(currentPageState);
    return nav_buttons.find((btn) => btn.name === currentPage).icon;
}