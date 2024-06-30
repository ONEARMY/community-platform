import { Meta, StoryFn } from '@storybook/react';
import { CommentList } from './CommentList';

declare const _default: Meta<typeof CommentList>;
export default _default;
export declare const Default: StoryFn<typeof CommentList>;
export declare const Expandable: StoryFn<typeof CommentList>;
export declare const WithNestedComments: StoryFn<typeof CommentList>;
export declare const WithNestedCommentsAndReplies: StoryFn<typeof CommentList>;
export declare const WithNestedCommentsAndRepliesMaxDepthTwo: StoryFn<typeof CommentList>;
export declare const Highlighted: StoryFn<typeof CommentList>;
