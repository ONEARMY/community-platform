import { IComment } from '../CommentItem/types';

export interface IProps {
    comment: string;
    comments: IComment[];
    handleDelete: (_id: string) => Promise<void>;
    handleEdit: (_id: string, comment: string) => Promise<void>;
    handleEditRequest: () => Promise<void>;
    highlightedCommentId?: string;
    isLoggedIn: boolean;
    maxLength: number;
    onChange: (comment: string) => void;
    onMoreComments: () => void;
    onSubmit: (comment: string) => void;
    onSubmitReply: (_id: string, reply: string) => Promise<void>;
    showAvatar: boolean;
    supportReplies?: boolean;
}
export declare const DiscussionContainer: (props: IProps) => import("react/jsx-runtime").JSX.Element;
