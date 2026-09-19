import '@testing-library/jest-dom/vitest';

import { describe, expect, it } from 'vitest';

import { render } from '../test/utils';
import { UserStatistics } from './UserStatistics';

import type { UserStatisticsProps } from './UserStatistics';

describe('UserStatistics', () => {
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

  it('renders correctly', () => {
    const { container } = render(<UserStatistics {...defaultProps} />);

    expect(container).toBeTruthy();
  });

  it('renders location link when country and userName are provided', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const locationLink = getByTestId('location-link');

    expect(locationLink).toHaveTextContent('Greenland');
  });

  it('renders project link when on library stats', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const libraryLink = getByTestId('library-link');

    expect(libraryLink.getAttribute('href')).toBe('/library?q=Test User');
  });

  it('renders research link when on research stats', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const researchLink = getByTestId('research-link');

    expect(researchLink.getAttribute('href')).toBe('/research?q=Test User');
  });

  it('renders useful count when usefulCount is provided', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const usefulCount = getByTestId('useful-stat');

    expect(usefulCount).toHaveTextContent('Useful: 20');
  });

  it('renders library count when libraryCount is provided', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const libraryCount = getByTestId('library-stat');

    expect(libraryCount).toHaveTextContent(/^Library: 10$/);
  });

  it('renders research count when researchCount is provided', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const researchCount = getByTestId('research-stat');

    expect(researchCount).toHaveTextContent(/^Research: 2$/);
  });

  it('renders questions link when questionCount is provided', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const questionsLink = getByTestId('questions-link');

    expect(questionsLink.getAttribute('href')).toBe('/questions');
  });

  it('renders questions count when questionCount is provided', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const questionsCount = getByTestId('questions-stat');

    expect(questionsCount).toHaveTextContent(/^Questions: 5$/);
  });

  it('renders profile views when showViews is true', () => {
    const { getByTestId } = render(<UserStatistics {...defaultProps} />);
    const viewsStat = getByTestId('profile-views-stat');

    expect(viewsStat).toHaveTextContent('Views: 100');
  });

  it('does not render profile views when showViews is false', () => {
    const { queryByTestId } = render(<UserStatistics {...defaultProps} showViews={false} />);
    const viewsStat = queryByTestId('profile-views-stat');

    expect(viewsStat).not.toBeInTheDocument();
  });

  it('renders badges when provided', () => {
    const propsWithBadges: UserStatisticsProps = {
      ...defaultProps,
      profile: {
        ...defaultProps.profile,
        badges: [
          {
            id: 1,
            name: 'supporter',
            displayName: 'Supporter',
            imageUrl: '/badge.png',
          },
        ],
      },
    };
    const { getByTestId } = render(<UserStatistics {...propsWithBadges} />);
    const badge = getByTestId('badge_supporter');

    expect(badge).toBeInTheDocument();
  });
});
