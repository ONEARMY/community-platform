import { render } from '../tests/utils'
import { waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { Default } from './ImageGallery.stories';
import { ImageGallery } from './ImageGallery'
import type { ImageGalleryProps } from './ImageGallery'

describe('ImageGallery', () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    });
  })

  it('handles empty image prop', () => {
    const { container } = render(<ImageGallery images={undefined as any} />)

    expect(container).toBeEmptyDOMElement()
  });

  it('renders correct image after clicking in its thumbnail', () => {
    const { getByTestId, getAllByTestId } = render(
      <Default {...(Default.args as ImageGalleryProps)} />,
    )
    const mainImage = getByTestId('active-image');
    expect(mainImage).toBeInTheDocument();

    const thumbnails = getAllByTestId('thumbnail');
    const firstThumbnail = thumbnails[0];

    firstThumbnail.click();

    const firstThumbnailImage = firstThumbnail.firstElementChild;
    expect(mainImage.getAttribute("src")).toEqual(firstThumbnailImage?.getAttribute("src"));


    const thirdThumbnail = thumbnails[2];
    thirdThumbnail.click();

    const thirdThumbnailImage = thirdThumbnail.firstElementChild;
    expect(mainImage.getAttribute("src")).toEqual(thirdThumbnailImage?.getAttribute("src"));
  });

  it('displays correct image in lightbox after clicking on the main image', async () => {
    const { getByRole, findByRole, getByTestId } = render(
      <Default {...(Default.args as ImageGalleryProps)} />,
    )
    const mainImage = getByTestId('active-image');
    expect(mainImage).toBeInTheDocument();

    mainImage.click();

    const lightboxDialog = await findByRole('dialog');
    expect(lightboxDialog).toBeInTheDocument();

    // Waits for the image to load
    // TODO: fix this, not working
    await waitFor(() => {
      const group = getByRole("group", { hidden: false });
      expect(group).toBeInTheDocument();
      
      const image = group.querySelector("img");
      expect(image).toBeInTheDocument();
      expect(image?.getAttribute("src")).toEqual(mainImage.getAttribute("src"));
    })
  });
})
