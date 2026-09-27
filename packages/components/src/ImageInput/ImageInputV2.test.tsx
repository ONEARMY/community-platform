import '@testing-library/jest-dom/vitest';

import type { MediaWithPublicUrl } from 'oa-shared';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { ImageInputV2 } from './ImageInputV2';

const image = {
  id: 'image-1',
  path: 'images/image-1.png',
  fullPath: 'library/images/image-1.png',
  publicUrl: 'https://example.com/image-1.png',
} as MediaWithPublicUrl;

const getCornerChip = (container: HTMLElement) =>
  container.querySelector('[data-cy="image-delete-corner"]');

describe('ImageInputV2', () => {
  it('renders the hover overlay and no corner chip when deleteVariant is omitted', () => {
    const { container, getByTestId } = render(
      <ImageInputV2 onFilesChange={vi.fn()} image={image} />,
    );

    expect(getByTestId('delete-image')).toBeInTheDocument();
    expect(getCornerChip(container)).toBeNull();
  });

  it('renders the corner chip when deleteVariant is cornerIcon', () => {
    const { container } = render(
      <ImageInputV2 onFilesChange={vi.fn()} image={image} deleteVariant="cornerIcon" />,
    );

    expect(getCornerChip(container)).toBeInTheDocument();
  });

  it('renders the upload prompt instead of any delete control when there is no image', () => {
    const { container, getByText, queryByTestId } = render(
      <ImageInputV2 onFilesChange={vi.fn()} />,
    );

    expect(getByText('Upload')).toBeInTheDocument();
    expect(queryByTestId('delete-image')).toBeNull();
    expect(getCornerChip(container)).toBeNull();
  });
});
