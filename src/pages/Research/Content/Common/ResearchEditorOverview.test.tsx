import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { FactoryResearchItem, FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { researchService } from '../../research.service';
import { ResearchEditorOverview } from './ResearchEditorOverview';

vi.mock('src/common/Toast/useToast', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}));

vi.mock('../../research.service', () => ({
  researchService: { reorderUpdates: vi.fn() },
}));

const research = FactoryResearchItem({
  id: 10,
  slug: 'abc',
  updates: [
    FactoryResearchItemUpdate({ id: 1, title: 'Update 1' }),
    FactoryResearchItemUpdate({ id: 2, title: 'Update 2' }),
    FactoryResearchItemUpdate({ id: 3, title: 'Update 3', deleted: true }),
  ],
});

const renderOverview = (props: Partial<Parameters<typeof ResearchEditorOverview>[0]> = {}) =>
  render(
    <MemoryRouter>
      <ResearchEditorOverview research={research} {...props} />
    </MemoryRouter>,
  );

const titles = () => screen.getAllByRole('listitem').map((li) => li.textContent);

describe('ResearchEditorOverview', () => {
  beforeEach(() => {
    vi.mocked(researchService.reorderUpdates).mockReset();
  });

  it('lists non-deleted updates and the new update being created', () => {
    renderOverview({ newUpdateTitle: 'New one' });

    expect(titles()).toEqual(['Update 1Edit', 'Update 2Edit', 'DraftNew one']);
  });

  it('hides move buttons unless sortable', () => {
    renderOverview();

    expect(screen.queryByLabelText('Move Update 1 down')).not.toBeInTheDocument();
  });

  it('only saves the order once confirmed', async () => {
    renderOverview({ sortable: true });

    expect(screen.getByLabelText('Move Update 1 up')).toBeDisabled();
    expect(screen.queryByText('Save order')).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText('Move Update 1 down'));

    expect(titles()).toEqual(['Update 2Edit', 'Update 1Edit']);
    expect(researchService.reorderUpdates).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText('Save order'));

    expect(researchService.reorderUpdates).toHaveBeenCalledWith(10, [2, 1]);
    await waitFor(() => expect(screen.queryByText('Save order')).not.toBeInTheDocument());
  });

  it('restores the saved order on cancel', async () => {
    renderOverview({ sortable: true });

    await userEvent.click(screen.getByLabelText('Move Update 1 down'));
    await userEvent.click(screen.getByText('Cancel'));

    expect(titles()).toEqual(['Update 1Edit', 'Update 2Edit']);
    expect(researchService.reorderUpdates).not.toHaveBeenCalled();
  });
});
