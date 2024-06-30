import { ThemeUIStyleObject } from 'theme-ui';

export interface Props {
    status: string;
    contentType: 'event' | 'howto' | 'research' | 'question';
    sx?: ThemeUIStyleObject;
}
export declare const ModerationStatus: (props: Props) => import("react/jsx-runtime").JSX.Element | null;
