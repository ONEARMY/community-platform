import { IComment } from '../CommentItem/types';

type CommentWithRepliesParent = IComment & {
    parentCommentId?: string;
};
export declare const transformToTree: (comments: CommentWithRepliesParent[]) => CommentWithRepliesParent[];
export {};
