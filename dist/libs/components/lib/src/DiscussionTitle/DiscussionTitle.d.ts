import { IComment } from '../CommentItem/types';

export declare const NO_COMMENTS = "Start the discussion";
export declare const ONE_COMMENT = "1 Comment";
export declare const COMMENTS = "Comments";
export interface IProps {
    comments: IComment[];
}
export declare const nonDeletedCommentsCount: (comments: IComment[]) => number;
export declare const DiscussionTitle: ({ comments }: IProps) => import("react/jsx-runtime").JSX.Element;
