import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { theme } from 'oa-themes';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { FactoryRemake, FactoryRemakeImage } from 'src/test/factories/Remake';
import { ThemeProvider } from '@theme-ui/core';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { RemakeViewModal } from './RemakeViewModal';

import type { Remake } from 'oa-shared';

const mockUseProfileStore = vi.hoisted(() => vi.fn());

vi.mock('src/stores/Profile/profile.store', () => ({
  useProfileStore: mockUseProfileStore,
}));

const getWrapper = (remakes: Remake[], onChangeIndex = vi.fn(), isNavDisabled = false) =>
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        <RemakeViewModal
          remakes={remakes}
          activeIndex={0}
          isNavDisabled={isNavDisabled}
          onChangeIndex={onChangeIndex}
          onClose={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );

describe('RemakeViewModal', () => {
  beforeAll(() => {
    mockUseProfileStore.mockReturnValue({ profile: null });
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
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
});
