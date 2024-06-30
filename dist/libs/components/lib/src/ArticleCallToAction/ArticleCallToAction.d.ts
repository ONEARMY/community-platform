import { User } from '../types/common';

export interface IProps {
    author: User;
    children: React.ReactNode;
    contributors?: User[];
}
export declare const ArticleCallToAction: (props: IProps) => import("react/jsx-runtime").JSX.Element;
