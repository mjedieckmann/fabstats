/**
 * Defines utility functions that are available everywhere in the application.
 */

import {useRecoilState} from "recoil";
import {notificationState, notificationTypeState} from "./_globalState";

/**
 * Capitalize the first letter of a string.
 * @param string
 * @returns {string}
 */
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Can the user edit the entity?
 * @param entity
 * @param user
 * @returns {boolean}
 */
export const entityIsEditableByUser = (entity, user) => {
    return user !== null && user !== 0 && entity !== null && entity.created_by === user._id;
}

/**
 * Prevent form submission when the authentication presses the "Enter" (or "NumpadEnter") key.
 * @param e
 */
export const preventSubmitOnEnter = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
    }
}

/**
 * Components can use the function exposed by this hook to send a notification to the authentication.
 * @returns {showNotification}
 */
export const useNotification = () => {
    const [ , setNotification] = useRecoilState(notificationState);
    const [ , setNotificationType ] = useRecoilState(notificationTypeState);

    return (notification, notificationType = 'success') => {
        setNotificationType(notificationType);
        setNotification((prev) => [...prev, {message: notification, key: new Date().getTime()}]);
    };
}