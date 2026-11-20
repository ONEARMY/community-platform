import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theme } from 'oa-themes';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { FactoryRemake, FactoryRemakeAuthor, FactoryRemakeImage } from 'src/test/factories/Remake';
import { ThemeProvider } from '@theme-ui/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RemakeViewModal } from './RemakeViewModal';

import type { Remake } from 'oa-shared';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

const getWrapper = (
  remakes: Remake[],
  onChangeIndex = vi.fn(),
  isNavDisabled = false,
  onEdit = vi.fn(),
  onDelete = vi.fn(),
) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <RemakeViewModal
          remakes={remakes}
          activeIndex={0}
          isNavDisabled={isNavDisabled}
          onChangeIndex={onChangeIndex}
          onClose={vi.fn()}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('RemakeViewModal', () => {
  beforeEach(() => {
    mockUseProfileStore.mockReturnValue({ profile: null });
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true;
    };
    HTMLDialogElement.prototype.close = function () {
      this.open = false;
    };
  });

  it('moves through the images with the arrow keys', async () => {
    const images = [
      FactoryRemakeImage({ publicUrl: 'https://example.com/first.webp' }),
      FactoryRemakeImage({ publicUrl: 'https://example.com/second.webp' }),
    ];
    getWrapper([FactoryRemake({ images })]);

    expect(screen.getByAltText('Remake image 1 of 2')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByAltText('Remake image 2 of 2')).toBeInTheDocument();

    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByAltText('Remake image 1 of 2')).toBeInTheDocument();
  });

  it('moves to the next remake when arrowing past the last image', async () => {
    const onChangeIndex = vi.fn();
    const remakes = [
      FactoryRemake({ images: [FactoryRemakeImage(), FactoryRemakeImage()] }),
      FactoryRemake(),
    ];
    getWrapper(remakes, onChangeIndex);

    await userEvent.keyboard('{ArrowRight}');
    expect(onChangeIndex).not.toHaveBeenCalled();

    await userEvent.keyboard('{ArrowRight}');
    expect(onChangeIndex).toHaveBeenCalledWith(1);
  });

  it('ignores the arrow keys while navigation is disabled', async () => {
    const onChangeIndex = vi.fn();
    const remakes = [FactoryRemake({ images: [FactoryRemakeImage()] }), FactoryRemake()];
    getWrapper(remakes, onChangeIndex, true);

    await userEvent.keyboard('{ArrowRight}');

    expect(onChangeIndex).not.toHaveBeenCalled();
    expect(screen.getByAltText('Remake image 1 of 1')).toBeInTheDocument();
  });

  it('stays put when there is no next remake to move to', async () => {
    const onChangeIndex = vi.fn();
    getWrapper([FactoryRemake({ images: [FactoryRemakeImage()] })], onChangeIndex);

    await userEvent.keyboard('{ArrowRight}{ArrowLeft}');

    expect(onChangeIndex).not.toHaveBeenCalled();
  });

  it('lands on the last image when arrowing back into the previous remake', async () => {
    const remakes = [
      FactoryRemake({ images: [FactoryRemakeImage(), FactoryRemakeImage()] }),
      FactoryRemake({ images: [FactoryRemakeImage()] }),
    ];

    const ControlledModal = () => {
      const [activeIndex, setActiveIndex] = useState(1);

      return (
        <RemakeViewModal
          remakes={remakes}
          activeIndex={activeIndex}
          onChangeIndex={setActiveIndex}
          onClose={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      );
    };

    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <ControlledModal />
        </MemoryRouter>
      </ThemeProvider>,
    );

    await userEvent.keyboard('{ArrowLeft}');

    expect(screen.getByAltText('Remake image 2 of 2')).toBeInTheDocument();
  });

  it('renders remake actions inside the dialog', async () => {
    const author = FactoryRemakeAuthor();
    mockUseProfileStore.mockReturnValue({ profile: { username: author.username, roles: [] } });
    getWrapper([FactoryRemake({ author })]);

    await userEvent.click(screen.getByRole('button', { name: 'Show Actions' }));

    const action = await screen.findByRole('menuitem', { name: 'Edit' });
    expect(document.querySelector('dialog')?.contains(action)).toBe(true);
  });

  it.each(['Edit', 'Delete'])('invokes the %s action with the current remake', async (action) => {
    const author = FactoryRemakeAuthor();
    const remake = FactoryRemake({ author });
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    mockUseProfileStore.mockReturnValue({ profile: { username: author.username, roles: [] } });
    getWrapper([remake], vi.fn(), false, onEdit, onDelete);

    await userEvent.click(screen.getByRole('button', { name: 'Show Actions' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: action }));

    expect(action === 'Edit' ? onEdit : onDelete).toHaveBeenCalledWith(remake);
  });

  it('does not show remake actions to another user', () => {
    mockUseProfileStore.mockReturnValue({ profile: { username: 'another-user', roles: [] } });
    getWrapper([FactoryRemake()]);

    expect(screen.queryByRole('button', { name: 'Show Actions' })).not.toBeInTheDocument();
  });

  it('keeps carousel navigation separate from the action menu keyboard input', async () => {
    const author = FactoryRemakeAuthor();
    mockUseProfileStore.mockReturnValue({ profile: { username: author.username, roles: [] } });
    getWrapper([FactoryRemake({ author, images: [FactoryRemakeImage(), FactoryRemakeImage()] })]);

    await userEvent.click(screen.getByRole('button', { name: 'Show Actions' }));
    await screen.findByRole('menuitem', { name: 'Edit' });
    await userEvent.keyboard('{ArrowRight}');

    expect(screen.getByAltText('Remake image 1 of 2')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}{ArrowRight}');

    expect(screen.getByAltText('Remake image 2 of 2')).toBeInTheDocument();
  });
});
