import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render } from '../test/utils';
import { MultipleImageInput } from './MultipleImageInput';

const images = [
  {
    id: '1',
    path: 'pictures/1.jpg',
    fullPath: 'pictures/1.jpg',
    publicUrl: 'https://example.com/pictures/1.jpg',
  },
  {
    id: '2',
    path: 'pictures/2.jpg',
    fullPath: 'pictures/2.jpg',
    publicUrl: 'https://example.com/pictures/2.jpg',
  },
];

describe('MultipleImageInput', () => {
  it('renders the upload button while below the maximum', () => {
    const { getByText, getAllByTestId } = render(
      <MultipleImageInput
        images={images}
        maxImages={4}
        buttonLabel="Upload 1-4 pictures"
        onFilesSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(getByText('Upload 1-4 pictures')).toBeInTheDocument();
    expect(getAllByTestId('multiple-image-input-thumbnail')).toHaveLength(2);
  });

  it('hides the upload button at the maximum and deletes by index', () => {
    const onDelete = vi.fn();
    const { queryByText, getAllByTestId } = render(
      <MultipleImageInput
        images={images}
        maxImages={2}
        buttonLabel="Upload 1-4 pictures"
        onFilesSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );

    expect(queryByText('Upload 1-4 pictures')).not.toBeInTheDocument();

    fireEvent.click(getAllByTestId('delete-image')[1]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('rejects more files than the remaining slots', () => {
    const onFilesSelect = vi.fn();
    const onError = vi.fn();
    const { getByTestId } = render(
      <MultipleImageInput
        images={images}
        maxImages={3}
        buttonLabel="Upload 1-4 pictures"
        onFilesSelect={onFilesSelect}
        onDelete={vi.fn()}
        onError={onError}
      />,
    );

    const file = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    fireEvent.change(getByTestId('multiple-image-input'), {
      target: { files: [file, file] },
    });

    expect(onError).toHaveBeenCalledWith('You can upload at most 3 pictures.');
    expect(onFilesSelect).not.toHaveBeenCalled();
  });
});
