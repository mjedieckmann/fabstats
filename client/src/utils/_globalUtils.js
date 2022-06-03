import {useRecoilState} from "recoil";
import {notificationTypeState, notificationState} from "./_globalState";

export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const entityIsEditableByUser = (entity, user) => {
    return user !== null && user !== 0 && entity !== null && entity.created_by === user._id;
}

export const preventSubmitOnEnter = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        e.preventDefault();
    }
}

export const useNotification = () => {
    const [ , setNotification] = useRecoilState(notificationState);
    const [ , setNotificationType ] = useRecoilState(notificationTypeState);

    const showNotification = (notification, notificationType='success') => {
        setNotificationType(notificationType);
        setNotification((prev) => [...prev, { message: notification, key: new Date().getTime() }]);
    };

    return showNotification;
}