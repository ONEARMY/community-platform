import '@testing-library/jest-dom/vitest';

import { act, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { ImageGallery } from './ImageGallery';
import { testImages } from './ImageGallery.stories';

describe('ImageGallery', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  beforeEach(() => {
    // Clean up any existing PhotoSwipe instance
    if ((global.window as any).pswp) {
      (global.window as any).pswp.destroy();
      delete (global.window as any).pswp;
    }
  });

  it('handles empty image prop', () => {
    const { container } = render(<ImageGallery images={undefined as any} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders correct image after clicking in its thumbnail', async () => {
    const { getByTestId, getAllByTestId } = render(<ImageGallery images={testImages} />);
    const mainImage = getByTestId('active-image');
    expect(mainImage).toBeInTheDocument();

    const thumbnails = getAllByTestId('thumbnail');
    const firstThumbnail = thumbnails[0];

    act(() => {
      firstThumbnail.click();
    });

    await waitFor(() => {
      expect(mainImage.getAttribute('src')).toEqual(testImages[0].downloadUrl);
    });

    const thirdThumbnail = thumbnails[2];
    act(() => {
      thirdThumbnail.click();
    });

    await waitFor(() => {
      expect(mainImage.getAttribute('src')).toEqual(testImages[2].downloadUrl);
    });
  });

  it('displays correct image in lightbox after clicking on the main image', async () => {
    const { findByRole, getByTestId } = render(
      <ImageGallery
        images={testImages}
        photoSwipeOptions={{
          // Forces a viewport size so that the images can be loaded
          getViewportSizeFn: function () {
            return {
              x: 200,
              y: 200,
            };
          },
        }}
      />,
    );

    const mainImage = getByTestId('active-image');
    expect(mainImage).toBeInTheDocument();

    mainImage.click();

    const lightboxDialog = await findByRole('dialog');
    expect(lightboxDialog).toBeInTheDocument();

    const group = await findByRole('group', { hidden: false });
    expect(group).toBeInTheDocument();

    // PhotoSwipe doesn't expose images with proper accessibility roles, so we query directly
    // Wait for the actual image (not placeholder) to be loaded
    await waitFor(() => {
      const image = group.querySelector('img.pswp__img:not(.pswp__img--placeholder)');
      expect(image).toBeInTheDocument();
      expect(image?.getAttribute('src')).toEqual(mainImage.getAttribute('src'));
    });
  });

  it('switches images in the lightbox after clicking on the next and previous arrows', async () => {
    const { findByRole, getByTestId, getByLabelText, getAllByRole } = render(
      <ImageGallery
        images={testImages}
        photoSwipeOptions={{
          // Forces a viewport size so that the images can be loaded
          getViewportSizeFn: function () {
            return {
              x: 200,
              y: 200,
            };
          },
        }}
      />,
    );

    const mainImage = getByTestId('active-image');
    expect(mainImage).toBeInTheDocument();

    mainImage.click();

    const lightboxDialog = await findByRole('dialog');
    expect(lightboxDialog).toBeInTheDocument();

    // Find the active slide (aria-hidden="false")
    await waitFor(() => {
      const groups = getAllByRole('group', { hidden: false });
      const activeGroup = groups.find((g) => g.getAttribute('aria-hidden') === 'false');
      expect(activeGroup).toBeInTheDocument();

      const image = activeGroup?.querySelector('img.pswp__img:not(.pswp__img--placeholder)');
      expect(image).toBeInTheDocument();
      expect(image?.getAttribute('src')).toEqual(mainImage.getAttribute('src'));
    });

    // Clicks on the next button
    const nextImageButton = getByLabelText('Next');
    act(() => {
      nextImageButton.click();
    });

    // Verifies that the image shown in the lightbox is the next image
    await waitFor(() => {
      const groups = getAllByRole('group', { hidden: false });
      const activeGroup = groups.find((g) => g.getAttribute('aria-hidden') === 'false');
      expect(activeGroup).toBeInTheDocument();

      const image = activeGroup?.querySelector('img.pswp__img:not(.pswp__img--placeholder)');
      expect(image).toBeInTheDocument();
      expect(image?.getAttribute('src')).toEqual(testImages[1].downloadUrl);
    });

    // Clicks on the previous button
    const previousImageButton = getByLabelText('Previous');
    act(() => {
      previousImageButton.click();
    });

    // Verifies that the image shown in the lightbox is the previous image
    await waitFor(() => {
      const groups = getAllByRole('group', { hidden: false });
      const activeGroup = groups.find((g) => g.getAttribute('aria-hidden') === 'false');
      expect(activeGroup).toBeInTheDocument();

      const image = activeGroup?.querySelector('img.pswp__img:not(.pswp__img--placeholder)');
      expect(image).toBeInTheDocument();
      expect(image?.getAttribute('src')).toEqual(testImages[0].downloadUrl);
    });
  });

  it('hides thumbnail for single image', () => {
    const { getAllByTestId } = render(<ImageGallery images={[testImages[0]]} />);

    expect(() => {
      getAllByTestId('thumbnail');
    }).toThrow();
  });

  it('supports no thumbnail option', () => {
    const { getAllByTestId } = render(<ImageGallery images={testImages} hideThumbnails />);

    expect(() => {
      getAllByTestId('thumbnail');
    }).toThrow();
  });

  it('supports show next/previous buttons', () => {
    const { getByRole } = render(
      <ImageGallery images={testImages} hideThumbnails showNextPrevButton={true} />,
    );

    const nextBtn = getByRole('button', { name: 'Next image' });
    const previousBtn = getByRole('button', { name: 'Previous image' });

    expect(nextBtn).toBeInTheDocument();
    expect(previousBtn).toBeInTheDocument();
  });

  it('does not support show next/previous buttons because only one image', () => {
    const { queryByRole } = render(
      <ImageGallery images={[testImages[0]]} hideThumbnails showNextPrevButton={true} />,
    );

    const nextBtn = queryByRole('button', { name: 'Next image' });
    const previousBtn = queryByRole('button', { name: 'Previous image' });

    expect(nextBtn).not.toBeInTheDocument();
    expect(previousBtn).not.toBeInTheDocument();
  });
});
