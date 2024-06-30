import { ThemeUIStyleObject } from 'theme-ui';

export interface IProps {
    hasUserVotedUseful: boolean;
    votedUsefulCount: number | undefined;
    isLoggedIn: boolean;
    onUsefulClick: () => Promise<void>;
    sx?: ThemeUIStyleObject;
}
export declare const UsefulStatsButton: (props: IProps) => import("react/jsx-runtime").JSX.Element;
