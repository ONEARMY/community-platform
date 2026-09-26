import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VideoPlayer } from './video-player';

describe('VideoPlayer', () => {
  it('renders the VideoPlayer container with data-testid', () => {
    render(
      <VideoPlayer videoUrl="https://www.youtube.com/watch?v=anqfVCLRQHE" />,
    );

    const player = screen.getByTestId('VideoPlayer');
    expect(player).toBeInTheDocument();
    expect(player).toHaveClass('aspect-video');
  });

  it('supports custom aspectRatio', () => {
    render(
      <VideoPlayer
        aspectRatio="square"
        videoUrl="https://www.youtube.com/watch?v=anqfVCLRQHE"
      />,
    );

    const player = screen.getByTestId('VideoPlayer');
    expect(player).toHaveClass('aspect-square');
  });
});
