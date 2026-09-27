import '@testing-library/jest-dom/vitest';

import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theme } from 'oa-themes';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { FactoryLibraryItem } from 'src/test/factories/Library';
import { FactoryRemake } from 'src/test/factories/Remake';
import { ThemeProvider } from '@theme-ui/core';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { RemakeFormModal } from './RemakeFormModal';

import type { Project, Remake } from 'oa-shared';

const mockCreateRemake = vi.hoisted(() => vi.fn());

vi.mock('src/services/remakeService', () => ({
  remakeService: {
    getRemakes: vi.fn(),
    createRemake: mockCreateRemake,
    updateRemake: vi.fn(),
    deleteRemake: vi.fn(),
  },
}));

vi.mock('src/services/storageService', () => ({
  storageService: {
    imageUpload: vi.fn(),
  },
}));

const project = FactoryLibraryItem() as Project;

const getWrapper = (remake: Remake | null = null) => {
  const router = createMemoryRouter([
    {
      path: '/',
      element: (
        <ThemeProvider theme={theme}>
          <RemakeFormModal
            project={project}
            remake={remake}
            onClose={vi.fn()}
            onCreated={vi.fn()}
            onUpdated={vi.fn()}
            onDeleted={vi.fn()}
          />
        </ThemeProvider>
      ),
    },
  ]);

  return render(<RouterProvider router={router} />);
};

describe('RemakeFormModal', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows an error and does not submit when no image was uploaded', async () => {
    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    expect(wrapper.getByText('Add your remake')).toBeInTheDocument();

    await userEvent.click(wrapper.container.querySelector('[data-cy=remake-submit]'));

    await waitFor(() => {
      expect(wrapper.getByText('Upload at least 1 image')).toBeInTheDocument();
      expect(wrapper.getByText("Ouch, something's wrong")).toBeInTheDocument();
      expect(mockCreateRemake).not.toHaveBeenCalled();
    });
  });

  it('updates the character counter while typing a description', async () => {
    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    expect(wrapper.getByText('0/1000')).toBeInTheDocument();

    await userEvent.type(
      wrapper.container.querySelector('[data-cy=remake-description-input]'),
      'Made this!',
    );

    await waitFor(() => {
      expect(wrapper.getByText('10/1000')).toBeInTheDocument();
    });
  });

  it('shows the delete button only when editing', async () => {
    const remake = FactoryRemake();

    let wrapper;
    act(() => {
      wrapper = getWrapper(remake);
    });

    expect(wrapper.getByText('Edit remake')).toBeInTheDocument();
    expect(wrapper.container.querySelector('[data-cy=remake-form-delete]')).toBeInTheDocument();
    expect(wrapper.getByText('Save')).toBeInTheDocument();
  });

  it('does not show the delete button when adding', async () => {
    let wrapper;
    act(() => {
      wrapper = getWrapper();
    });

    expect(wrapper.container.querySelector('[data-cy=remake-form-delete]')).not.toBeInTheDocument();
    expect(wrapper.getByText('Publish')).toBeInTheDocument();
  });
});
