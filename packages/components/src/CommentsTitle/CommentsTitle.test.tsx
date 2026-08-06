import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { COMMENTS, CommentsTitle, NO_COMMENTS } from './CommentsTitle';

import type { Comment } from 'oa-shared';

describe('CommentsTitle', () => {
  it('renders correctly when there are zero comments', () => {
    const { getByText } = render(<CommentsTitle comments={[]} />);

    expect(getByText(NO_COMMENTS)).toBeInTheDocument();
  });

  it('renders correctly when there are comments', () => {
    const comment = {} as Comment;
    const { getByText } = render(<CommentsTitle comments={[comment, comment, comment]} />);

    expect(getByText(`3 ${COMMENTS}`)).toBeInTheDocument();
  });

  it('renders with a custom noun', () => {
    const comment = {} as Comment;
    const { getByText } = render(<CommentsTitle comments={[comment, comment]} noun="Answers" />);

    expect(getByText('2 Answers')).toBeInTheDocument();
  });

  it('singularizes the noun when there is exactly one comment', () => {
    const comment = {} as Comment;
    const { getByText } = render(<CommentsTitle comments={[comment]} noun="Answers" />);

    expect(getByText('1 Answer')).toBeInTheDocument();
  });

  it('singularizes the default noun when there is exactly one comment', () => {
    const comment = {} as Comment;
    const { getByText } = render(<CommentsTitle comments={[comment]} />);

    expect(getByText(`1 ${COMMENTS.slice(0, -1)}`)).toBeInTheDocument();
  });
});
