import { IComment } from './types';

export interface IProps {
    comment: IComment;
    handleDelete?: (commentId: string) => Promise<void>;
    handleEdit: (commentId: string, newCommentText: string) => void;
    handleEditRequest?: (commentId: string) => Promise<void>;
    isReply: boolean;
    showAvatar: boolean;
}
export declare const CommentItem: (props: IProps) => import("react/jsx-runtime").JSX.Element;
