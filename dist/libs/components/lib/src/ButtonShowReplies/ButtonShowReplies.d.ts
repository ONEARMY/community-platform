import { IComment } from '../CommentItem/types';

export interface Props {
    creatorName: string | null;
    isShowReplies: boolean;
    replies: IComment[];
    setIsShowReplies: () => void;
}
export declare const ButtonShowReplies: (props: Props) => import("react/jsx-runtime").JSX.Element;
