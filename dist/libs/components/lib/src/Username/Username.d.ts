import { User } from '../types/common';
import { ThemeUIStyleObject } from 'theme-ui';

export interface IProps {
    user: User;
    sx?: ThemeUIStyleObject;
}
export declare const Username: ({ user, sx }: IProps) => import("react/jsx-runtime").JSX.Element;
