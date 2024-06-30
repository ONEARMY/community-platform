import { IComment } from '../CommentItem/types';

interface IPropsShared {
    handleDelete: (_id: string) => Promise<void>;
    handleEdit: (_id: string, comment: string) => Promise<void>;
    handleEditRequest: () => Promise<void>;
    isLoggedIn: boolean;
    isReplies: boolean;
    maxLength: number;
    onSubmitReply?: (_id: string, reply: string) => Promise<void>;
    showAvatar: boolean;
}
export interface IPropsCommentContainer extends IPropsShared {
    comment: IComment;
    handleCommentReply?: (commentId: string | null) => void;
    supportReplies: boolean;
}
export interface IPropsCommentList extends IPropsShared {
    supportReplies?: boolean;
    comments: IComment[];
    highlightedCommentId?: string;
    onMoreComments?: () => void;
    setCommentBeingRepliedTo?: (commentId: string | null) => void;
}
export declare const CommentContainer: (props: IPropsCommentContainer) => import("react/jsx-runtime").JSX.Element | null;
export declare const CommentList: (props: IPropsCommentList) => import("react/jsx-runtime").JSX.Element;
export {};
