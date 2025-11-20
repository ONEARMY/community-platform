import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { createFakeCommentsSB } from '../utils';
import { ButtonShowReplies } from './ButtonShowReplies';
import { DefaultComponent } from './ButtonShowReplies.stories';

describe('ButtonShowReplies', () => {
  it('renders the button text', () => {
    const { getByTestId, getByText } = render(<DefaultComponent />);
    const icon = getByTestId('show-replies');

    expect(getByText('Show 7 replies')).toBeInTheDocument();
    expect(icon.getAttribute('icon')).toContain('chevron-down');
  });

  it('renders the button text', () => {
    const replies = createFakeCommentsSB(6);
    const { getByTestId } = render(
      <ButtonShowReplies isShowReplies={true} replies={replies} setIsShowReplies={() => null} />,
    );
    const icon = getByTestId('show-replies');

    expect(icon.getAttribute('icon')).toContain('chevron-up');
  });

  it('renders the word reply when expected', () => {
    const replies = createFakeCommentsSB(1);

    const { getByText } = render(
      <ButtonShowReplies isShowReplies={false} replies={replies} setIsShowReplies={() => null} />,
    );

    expect(getByText('Show 1 reply')).toBeInTheDocument();
  });

  it('renders the number zero when expected', () => {
    const { getByText } = render(
      <ButtonShowReplies isShowReplies={false} replies={[]} setIsShowReplies={() => null} />,
    );

    expect(getByText('Reply')).toBeInTheDocument();
  });
});
