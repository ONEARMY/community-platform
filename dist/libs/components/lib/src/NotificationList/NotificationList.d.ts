import { ThemeUIStyleObject } from 'theme-ui';
import { UserNotificationItem } from '../../../../../shared/src/index.ts';

export interface Props {
    notifications: UserNotificationItem[];
    markAllRead: () => void;
    markAllNotified: () => void;
    sx?: ThemeUIStyleObject;
}
export declare const NotificationList: (props: Props) => import("react/jsx-runtime").JSX.Element;
