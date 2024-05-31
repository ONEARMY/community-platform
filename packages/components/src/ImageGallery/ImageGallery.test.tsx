import '@testing-library/jest-dom/vitest'

import { findByRole as globalFindByRole, waitFor } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { render } from '../tests/utils'
import { ImageGallery } from './ImageGallery'
import {
  Default,
  DoNotShowNextPrevButtons,
  HideThumbnailForSingleImage,
  NoThumbnails,
  ShowNextPrevButtons,
  testImages,
} from './ImageGallery.stories'

import type { ImageGalleryProps } from './ImageGallery'

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
    })
  })

  beforeEach(async () => {
    // Required to wait for the window.pswp object to be reset after the component
    // unmounts, so that each test initializes the component correctly. The cleanup
    // of the window.pswp is made asynchronously with no way of waiting except this one
    await waitFor(() => {
      expect((global.window as any).pswp).toBeFalsy()
    })
  })

  it('handles empty image prop', () => {
    const { container } = render(<ImageGallery images={undefined as any} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders correct image after clicking in its thumbnail', () => {
    const { getByTestId, getAllByTestId } = render(
      <Default {...(Default.args as ImageGalleryProps)} />,
    )
    const mainImage = getByTestId('active-image')
    expect(mainImage).toBeInTheDocument()

    const thumbnails = getAllByTestId('thumbnail')
    const firstThumbnail = thumbnails[0]

    firstThumbnail.click()

    expect(mainImage.getAttribute('src')).toEqual(testImages[0].downloadUrl)

    const thirdThumbnail = thumbnails[2]
    thirdThumbnail.click()

    expect(mainImage.getAttribute('src')).toEqual(testImages[2].downloadUrl)
  })

  it('displays correct image in lightbox after clicking on the main image', async () => {
    const { findByRole, getByTestId } = render(
      <Default
        {...(Default.args as ImageGalleryProps)}
        photoSwipeOptions={{
          // Forces a viewport size so that the images can be loaded
          getViewportSizeFn: function () {
            return {
              x: 200,
              y: 200,
            }
          },
        }}
      />,
    )

    const mainImage = getByTestId('active-image')
    expect(mainImage).toBeInTheDocument()

    mainImage.click()

    const lightboxDialog = await findByRole('dialog')
    expect(lightboxDialog).toBeInTheDocument()

    const group = await findByRole('group', { hidden: false })
    expect(group).toBeInTheDocument()

    const image = await globalFindByRole(group, 'img', { hidden: false })
    expect(image).toBeInTheDocument()
    expect(image?.getAttribute('src')).toEqual(mainImage.getAttribute('src'))
  })

  it('switches images in the lightbox after clicking on the next and previous arrows', async () => {
    const { findByRole, getByTestId, getByLabelText } = render(
      <Default
        {...(Default.args as ImageGalleryProps)}
        photoSwipeOptions={{
          // Forces a viewport size so that the images can be loaded
          getViewportSizeFn: function () {
            return {
              x: 200,
              y: 200,
            }
          },
        }}
      />,
    )

    const mainImage = getByTestId('active-image')
    expect(mainImage).toBeInTheDocument()

    mainImage.click()

    const lightboxDialog = await findByRole('dialog')
    expect(lightboxDialog).toBeInTheDocument()

    let group = await findByRole('group', { hidden: false })
    expect(group).toBeInTheDocument()

    let image = await globalFindByRole(group, 'img', { hidden: false })
    expect(image).toBeInTheDocument()
    expect(image?.getAttribute('src')).toEqual(mainImage.getAttribute('src'))

    // Clicks on the next button
    const nextImageButton = getByLabelText('Next')
    nextImageButton.click()

    // Verifies that the image shown in the lightbox is the next image
    group = await findByRole('group', { hidden: false })
    expect(group).toBeInTheDocument()

    image = await globalFindByRole(group, 'img', { hidden: false })
    expect(image).toBeInTheDocument()
    expect(image?.getAttribute('src')).toEqual(testImages[1].downloadUrl)

    // Clicks on the previous button
    const previousImageButton = getByLabelText('Previous')
    previousImageButton.click()

    // Verifies that the image shown in the lightbox is the previous image
    group = await findByRole('group', { hidden: false })
    expect(group).toBeInTheDocument()

    image = await globalFindByRole(group, 'img', { hidden: false })
    expect(image).toBeInTheDocument()
    expect(image?.getAttribute('src')).toEqual(testImages[0].downloadUrl)
  })

  it('hides thumbnail for single image', async () => {
    const { getAllByTestId } = render(
      <HideThumbnailForSingleImage
        {...(HideThumbnailForSingleImage.args as ImageGalleryProps)}
      />,
    )

    expect(() => {
      getAllByTestId('thumbnail')
    }).toThrow()
  })

  it('supports no thumbnail option', async () => {
    const { getAllByTestId } = render(
      <NoThumbnails {...(NoThumbnails.args as ImageGalleryProps)} />,
    )

    expect(() => {
      getAllByTestId('thumbnail')
    }).toThrow()
  })

  it('supports show next/previous buttons', async () => {
    const { getByRole } = render(
      <ShowNextPrevButtons
        {...(ShowNextPrevButtons.args as ImageGalleryProps)}
      />,
    )

    const nextBtn = getByRole('button', { name: 'Next image' })
    const previousBtn = getByRole('button', { name: 'Previous image' })

    expect(nextBtn).toBeInTheDocument()
    expect(previousBtn).toBeInTheDocument()
  })

  it('does not support show next/previous buttons because only one image', async () => {
    const { queryByRole } = render(
      <DoNotShowNextPrevButtons
        {...(DoNotShowNextPrevButtons.args as ImageGalleryProps)}
      />,
    )

    const nextBtn = queryByRole('button', { name: 'Next image' })
    const previousBtn = queryByRole('button', { name: 'Previous image' })

    expect(nextBtn).not.toBeInTheDocument()
    expect(previousBtn).not.toBeInTheDocument()
  })
})
