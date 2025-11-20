import { fakeCommentSB } from '../utils';
import { CommentDisplay } from './CommentDisplay';

import type { Meta, StoryFn } from '@storybook/react-vite';

export default {
  title: 'Commenting/CommentDisplay',
  component: CommentDisplay,
} as Meta<typeof CommentDisplay>;

const itemType = 'CommentItem';
const isEditable = false;
const isLoggedIn = true;
const votedUsefulCount = 0;
const hasUserVotedUseful = false;
const setShowDeleteModal = () => {};
const setShowEditModal = () => {};
const mockHandleUsefulClick = async (
  vote: 'add' | 'delete',
  eventCategory = 'Comment',
): Promise<void> => {
  console.log('handleUsefulClick called with:', { vote, eventCategory });
  return new Promise<void>((resolve) => setTimeout(() => resolve(), 300));
};

// Common useful button config
const usefulButtonConfig = {
  votedUsefulCount,
  hasUserVotedUseful,
  isLoggedIn,
  onUsefulClick: mockHandleUsefulClick,
};

export const Default: StoryFn<typeof CommentDisplay> = () => {
  const comment = fakeCommentSB();

  return (
    <CommentDisplay
      comment={comment}
      itemType={itemType}
      isEditable={isEditable}
      usefulButtonConfig={usefulButtonConfig}
      setShowDeleteModal={setShowDeleteModal}
      setShowEditModal={setShowEditModal}
    />
  );
};

export const Editable: StoryFn<typeof CommentDisplay> = () => {
  const comment = fakeCommentSB();

  return (
    <CommentDisplay
      comment={comment}
      itemType={itemType}
      isEditable={true}
      usefulButtonConfig={usefulButtonConfig}
      setShowDeleteModal={setShowDeleteModal}
      setShowEditModal={setShowEditModal}
    />
  );
};

export const Edited: StoryFn<typeof CommentDisplay> = () => {
  const comment = fakeCommentSB({ modifiedAt: new Date() });

  return (
    <CommentDisplay
      comment={comment}
      itemType={itemType}
      isEditable={isEditable}
      usefulButtonConfig={usefulButtonConfig}
      setShowDeleteModal={setShowDeleteModal}
      setShowEditModal={setShowEditModal}
    />
  );
};

export const LongText: StoryFn<typeof CommentDisplay> = () => {
  const commentText = `Ut dignissim, odio a cursus pretium, erat ex dictum quam, a eleifend augue mauris vel metus. Suspendisse pellentesque, elit efficitur rutrum maximus, arcu enim congue ipsum, vel aliquam ipsum urna quis tellus. Mauris at imperdiet nisi. Integer at neque ex. Nullam vel ipsum sodales, porttitor nulla vitae, tincidunt est. Pellentesque vitae lectus arcu. Integer dapibus rutrum facilisis. Nullam tincidunt quam at arcu interdum, vitae egestas libero vehicula. Morbi metus tortor, dapibus id finibus ac, egestas quis leo. Phasellus scelerisque suscipit mauris sed rhoncus. In quis ultricies ipsum. Integer vitae iaculis risus, sit amet elementum augue. Pellentesque vitae sagittis erat, eget consectetur lorem.\n\nUt pharetra molestie quam id dictum. In molestie, arcu sit amet faucibus pulvinar, eros erat egestas leo, at molestie nunc velit a arcu. Aliquam erat volutpat. Vivamus vehicula mi sit amet nibh auctor efficitur. Duis fermentum sem et nibh facilisis, ut tincidunt sem commodo. Nullam ornare ex a elementum accumsan. Etiam a neque ut lacus suscipit blandit. Maecenas id tortor velit.\n\nInterdum et malesuada fames ac ante ipsum primis in faucibus. Nam ut commodo tellus. Maecenas at leo metus. Vivamus ullamcorper ex purus, volutpat auctor nunc lobortis a. Integer sit amet ornare nisi, sed ultrices enim. Pellentesque ut aliquam urna, eu fringilla ante. Nullam dui nibh, feugiat id vestibulum nec, efficitur a lorem. In vitae pellentesque tellus. Pellentesque sed odio iaculis, imperdiet turpis at, aliquam ex. Praesent iaculis bibendum nibh, vel egestas turpis ultrices ac. Praesent tincidunt libero sed gravida ornare. Aliquam vehicula risus ut molestie suscipit. Nunc erat odio, venenatis nec posuere in, placerat eget massa. Sed in ultrices ex, vel egestas quam. Integer lectus magna, ornare at nisl sed, convallis euismod enim. Cras pretium commodo arcu non bibendum.\n\nNullam dictum lectus felis. Duis vitae lacus vitae nisl aliquet faucibus. Integer neque lacus, dignissim sed mi et, dignissim luctus metus. Cras sollicitudin vestibulum leo, ac ultrices sapien bibendum ac. Phasellus lobortis aliquam libero eu volutpat. Donec vitae rutrum tellus. Fusce vel ante ipsum. Suspendisse mollis tempus porta. Sed a orci tempor, rhoncus tortor eu, sodales justo.`;
  const comment = fakeCommentSB({ comment: commentText });

  return (
    <CommentDisplay
      comment={comment}
      itemType={itemType}
      isEditable={isEditable}
      usefulButtonConfig={usefulButtonConfig}
      setShowDeleteModal={setShowDeleteModal}
      setShowEditModal={setShowEditModal}
    />
  );
};

export const ShortTextWithLink: StoryFn<typeof CommentDisplay> = () => {
  const comment = fakeCommentSB({
    comment: `Ut dignissim, odio a cursus pretium. https://example.com`,
  });

  return (
    <CommentDisplay
      comment={comment}
      itemType={itemType}
      isEditable={isEditable}
      usefulButtonConfig={usefulButtonConfig}
      setShowDeleteModal={setShowDeleteModal}
      setShowEditModal={setShowEditModal}
    />
  );
};

export const UserVotedUseful: StoryFn<typeof CommentDisplay> = () => {
  const comment = fakeCommentSB();
  const votedConfig = {
    ...usefulButtonConfig,
    hasUserVotedUseful: true,
    votedUsefulCount: 5,
  };

  return (
    <CommentDisplay
      comment={comment}
      itemType={itemType}
      isEditable={isEditable}
      usefulButtonConfig={votedConfig}
      setShowDeleteModal={setShowDeleteModal}
      setShowEditModal={setShowEditModal}
    />
  );
};
