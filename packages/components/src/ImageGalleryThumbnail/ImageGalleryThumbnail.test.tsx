import '@testing-library/jest-dom/vitest';

import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { ImageGalleryThumbnail } from './ImageGalleryThumbnail';

describe('ImageGalleryThumbnail', () => {
  it('calls Callback, when image clicked', () => {
    const mockFn = vi.fn();
    const { getByTestId } = render(
      <ImageGalleryThumbnail
        activeImageIndex={0}
        allowPortrait={false}
        alt="alt"
        name="name"
        index={0}
        setActiveIndex={mockFn}
        thumbnailUrl="https://picsum.photos/id/29/150/150"
      />,
    );
    getByTestId('thumbnail').click();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
