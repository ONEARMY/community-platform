import '@testing-library/jest-dom/vitest';

import { subDays, subMonths } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { DisplayDate } from './DisplayDate';

describe('DisplayDate', () => {
  describe('relative time display', () => {
    it('renders "less than a minute ago" for current date', () => {
      const { getByText } = render(<DisplayDate createdAt={new Date()} />);
      expect(getByText('less than a minute ago', { exact: false })).toBeInTheDocument();
    });

    it('renders "2 months ago" for two months ago', () => {
      const twoMonthsAgo = subMonths(new Date(), 2);
      const { getByText } = render(<DisplayDate createdAt={twoMonthsAgo} />);
      expect(getByText('2 months ago', { exact: false })).toBeInTheDocument();
    });
  });

  describe('label selection', () => {
    it('shows "Created" for drafts (no publishedAt)', () => {
      const { getAllByText } = render(<DisplayDate createdAt={new Date()} />);
      expect(getAllByText('Created', { exact: false }).length).toBeGreaterThan(0);
    });

    it('shows "Published" when publishedAt is set', () => {
      const { getAllByText } = render(
        <DisplayDate createdAt={new Date()} publishedAt={new Date()} />,
      );
      expect(getAllByText('Published', { exact: false }).length).toBeGreaterThan(0);
    });

    it('shows custom publishedAction when provided', () => {
      const { getAllByText } = render(
        <DisplayDate createdAt={new Date()} publishedAt={new Date()} publishedAction="Started" />,
      );
      expect(getAllByText('Started', { exact: false }).length).toBeGreaterThan(0);
    });

    it('hides label when showLabel is false', () => {
      const { queryByText } = render(
        <DisplayDate createdAt={new Date()} publishedAt={new Date()} showLabel={false} />,
      );
      expect(queryByText('Published', { exact: false })).not.toBeInTheDocument();
    });
  });

  describe('edit indication', () => {
    it('shows "Last edit" when modified after publish', () => {
      const publishedAt = subDays(new Date(), 2);
      const modifiedAt = subDays(new Date(), 1);

      const { getByText } = render(
        <DisplayDate
          createdAt={subDays(new Date(), 3)}
          publishedAt={publishedAt}
          modifiedAt={modifiedAt}
        />,
      );
      expect(getByText('Last edit', { exact: false })).toBeInTheDocument();
    });

    it('does not show "Last edit" when modifiedAt equals publishedAt', () => {
      const now = new Date();

      const { queryByText } = render(
        <DisplayDate createdAt={subDays(now, 1)} publishedAt={now} modifiedAt={now} />,
      );
      expect(queryByText('Last edit', { exact: false })).not.toBeInTheDocument();
    });

    it('shows "Last edit" for draft when modified after creation', () => {
      const createdAt = subDays(new Date(), 2);
      const modifiedAt = subDays(new Date(), 1);

      const { getByText } = render(<DisplayDate createdAt={createdAt} modifiedAt={modifiedAt} />);
      expect(getByText('Last edit', { exact: false })).toBeInTheDocument();
    });
  });

  describe('tooltip', () => {
    it('shows formatted date in title', () => {
      const date = new Date();
      const { container } = render(<DisplayDate createdAt={date} />);

      const textElement = container.querySelector('[title]');
      expect(textElement?.getAttribute('title')).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/);
    });

    it('shows edit date in title when edited', () => {
      const createdAt = subDays(new Date(), 3);
      const publishedAt = subDays(new Date(), 2);
      const modifiedAt = subDays(new Date(), 1);

      const { container } = render(
        <DisplayDate createdAt={createdAt} publishedAt={publishedAt} modifiedAt={modifiedAt} />,
      );

      const textElement = container.querySelector('[title]');
      const title = textElement?.getAttribute('title');
      expect(title).toMatch(/^\d{2}-\d{2}-\d{4} \d{2}:\d{2} \(edited \d{2}-\d{2}-\d{4} \d{2}:\d{2}\)$/);
    });
  });
});
