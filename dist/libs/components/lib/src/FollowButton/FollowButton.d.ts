import { ThemeUIStyleObject } from 'theme-ui';

export interface IProps {
    hasUserSubscribed: boolean;
    isLoggedIn: boolean;
    onFollowClick: () => void;
    sx?: ThemeUIStyleObject;
}
export declare const FollowButton: (props: IProps) => import("react/jsx-runtime").JSX.Element;
