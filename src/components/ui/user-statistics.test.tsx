import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createRoutesStub } from 'react-router';
import { describe, expect, it } from 'vitest';
import { UserStatistics, type UserStatisticsProps } from './user-statistics';

const renderInRouter = (ui: ReactNode) => {
  const Stub = createRoutesStub([{ path: '/', Component: () => <>{ui}</> }]);
  return render(<Stub />);
};

const defaultProps: UserStatisticsProps = {
  profile: {
    id: 1,
    username: 'Test User',
    badges: [],
    totalViews: 100,
    country: 'Greenland',
  },
  pin: { country: 'Greenland' },
  libraryCount: 10,
  usefulCount: 20,
  researchCount: 2,
  questionCount: 5,
  showViews: true,
};

describe('UserStatistics', () => {
  it('renders nothing when there is nothing to show', () => {
    const { container } = renderInRouter(
      <UserStatistics
        profile={{ id: 1, username: 'Test User', badges: [], totalViews: 0, country: '' }}
        libraryCount={0}
        usefulCount={0}
        researchCount={0}
        questionCount={0}
        showViews
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders location link when country and userName are provided', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('location-link')).toHaveTextContent('Greenland');
    expect(getByTestId('location-link').getAttribute('href')).toBe('/map#Test User');
  });

  it('falls back to "View on Map" when the pin has no country', () => {
    const { getByTestId } = renderInRouter(
      <UserStatistics {...defaultProps} pin={{ country: '' }} />,
    );

    expect(getByTestId('location-link')).toHaveTextContent('Location: View on Map');
  });

  it('renders project link when on library stats', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('library-link').getAttribute('href')).toBe('/library?q=Test User');
  });

  it('renders research link when on research stats', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('research-link').getAttribute('href')).toBe('/research?q=Test User');
  });

  it('renders useful count when usefulCount is provided', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('useful-stat')).toHaveTextContent('Useful: 20');
  });

  it('renders library count when libraryCount is provided', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('library-stat')).toHaveTextContent(/^Library: 10$/);
  });

  it('renders research count when researchCount is provided', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('research-stat')).toHaveTextContent(/^Research: 2$/);
  });

  it('renders questions link when questionCount is provided', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('questions-link').getAttribute('href')).toBe('/questions');
  });

  it('renders questions count when questionCount is provided', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('questions-stat')).toHaveTextContent(/^Questions: 5$/);
  });

  it('hides counts that are zero', () => {
    const { queryByTestId } = renderInRouter(
      <UserStatistics {...defaultProps} libraryCount={0} researchCount={0} questionCount={0} />,
    );

    expect(queryByTestId('library-stat')).not.toBeInTheDocument();
    expect(queryByTestId('research-stat')).not.toBeInTheDocument();
    expect(queryByTestId('questions-stat')).not.toBeInTheDocument();
  });

  it('renders profile views when showViews is true', () => {
    const { getByTestId } = renderInRouter(<UserStatistics {...defaultProps} />);

    expect(getByTestId('profile-views-stat')).toHaveTextContent('Views: 100');
  });

  it('does not render profile views when showViews is false', () => {
    const { queryByTestId } = renderInRouter(
      <UserStatistics {...defaultProps} showViews={false} />,
    );

    expect(queryByTestId('profile-views-stat')).not.toBeInTheDocument();
  });

  it('renders badges, linking out when the badge has an actionUrl', () => {
    const { getByTestId } = renderInRouter(
      <UserStatistics
        {...defaultProps}
        profile={{
          ...defaultProps.profile,
          badges: [
            { id: 1, name: 'pro', displayName: 'PRO', imageUrl: '/pro.png' },
            {
              id: 2,
              name: 'supporter',
              displayName: 'Supporter',
              imageUrl: '/badge.png',
              actionUrl: 'https://example.com/support',
            },
          ],
        }}
      />,
    );

    expect(getByTestId('badge_pro')).toHaveTextContent('PRO');
    expect(getByTestId('badge_pro').querySelector('a')).toBeNull();
    expect(getByTestId('badge_supporter').querySelector('a')?.getAttribute('href')).toBe(
      'https://example.com/support',
    );
  });
});
