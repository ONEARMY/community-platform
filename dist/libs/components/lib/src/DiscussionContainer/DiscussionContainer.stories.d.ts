import { Meta, StoryObj } from '@storybook/react';
import { DiscussionContainer } from './DiscussionContainer';

declare const _default: Meta<typeof DiscussionContainer>;
export default _default;
type Story = StoryObj<typeof DiscussionContainer> & {
    render: () => JSX.Element;
};
export declare const Default: Story;
export declare const NoComments: Story;
export declare const LoggedIn: Story;
export declare const Expandable: Story;
export declare const WithReplies: Story;
