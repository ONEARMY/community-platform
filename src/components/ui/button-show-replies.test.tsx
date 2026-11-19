import '@testing-library/jest-dom/vitest';
import { fireEvent, render } from '@testing-library/react';
import type { Comment } from 'oa-shared';
import { describe, expect, it, vi } from 'vitest';
import { ButtonShowReplies } from '@/components/ui/button-show-replies';

const fakeReplies = (count: number) =>
  Array.from({ length: count }, (_, id) => ({ id, deleted: false }) as Comment);

describe('ButtonShowReplies', () => {
  it('renders the show text with the reply count', () => {
    const { getByText } = render(
      <ButtonShowReplies
        isShowReplies={false}
        replies={fakeReplies(7)}
        setIsShowReplies={vi.fn()}
      />,
    );

    expect(getByText('Show 7 replies')).toBeInTheDocument();
  });

  it('renders the hide text when replies are showing', () => {
    const { getByText } = render(
      <ButtonShowReplies isShowReplies replies={fakeReplies(6)} setIsShowReplies={vi.fn()} />,
    );

    expect(getByText('Hide 6 replies')).toBeInTheDocument();
  });

  it('renders the singular word when there is one reply', () => {
    const { getByText } = render(
      <ButtonShowReplies
        isShowReplies={false}
        replies={fakeReplies(1)}
        setIsShowReplies={vi.fn()}
      />,
    );

    expect(getByText('Show 1 reply')).toBeInTheDocument();
  });

  it('ignores deleted replies in the count', () => {
    const replies = [...fakeReplies(2), { id: 9, deleted: true } as Comment];
    const { getByText } = render(
      <ButtonShowReplies isShowReplies={false} replies={replies} setIsShowReplies={vi.fn()} />,
    );

    expect(getByText('Show 2 replies')).toBeInTheDocument();
  });

  it('renders Reply when there are no replies', () => {
    const { getByText } = render(
      <ButtonShowReplies isShowReplies={false} replies={[]} setIsShowReplies={vi.fn()} />,
    );

    expect(getByText('Reply')).toBeInTheDocument();
  });

  it('renders Hide when there are no replies and the form is showing', () => {
    const { getByText } = render(
      <ButtonShowReplies isShowReplies replies={[]} setIsShowReplies={vi.fn()} />,
    );

    expect(getByText('Hide')).toBeInTheDocument();
  });

  it('calls setIsShowReplies when clicked', () => {
    const setIsShowReplies = vi.fn();
    const { getByTestId } = render(
      <ButtonShowReplies isShowReplies={false} replies={[]} setIsShowReplies={setIsShowReplies} />,
    );

    fireEvent.click(getByTestId('show-replies'));

    expect(setIsShowReplies).toHaveBeenCalledTimes(1);
  });
});
