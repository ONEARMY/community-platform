import { describe, expect, it, vi } from 'vitest';

import { researchService } from './research.service';

describe('research.service', () => {
  describe('search', () => {
    it('fetches research articles based on search criteria', async () => {
      // Mock successful fetch response
      global.fetch = vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            items: [{ id: '1', title: 'Sample Research' }],
            total: 1,
          }),
      });

      // Call search with mock parameters
      const result = await researchService.search('sample', 'science', 'Newest', null);

      // Assert results
      expect(result).toEqual({
        items: [{ id: '1', title: 'Sample Research' }],
        total: 1,
      });
    });

    it('handles errors in search', async () => {
      global.fetch = vi.fn().mockRejectedValue('error');

      const result = await researchService.search('sample', 'science', 'Newest', null);

      expect(result).toEqual({ items: [], total: 0 });
    });
  });

  describe('getDraftCount', () => {
    it('fetches draft count for a user', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ total: 5 }),
      });

      const result = await researchService.getDraftCount();

      expect(result).toBe(5);
    });

    it('handles errors in fetching draft count', async () => {
      global.fetch = vi.fn().mockRejectedValue('error');

      const result = await researchService.getDraftCount();

      expect(result).toBe(0);
    });
  });

  describe('getDrafts', () => {
    it('fetches research drafts for a user', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            items: [{ id: 'draft1', title: 'Draft Research' }],
          }),
      });

      const result = await researchService.getDrafts();

      expect(result).toEqual([{ id: 'draft1', title: 'Draft Research' }]);
    });

    it('handles errors in fetching drafts', async () => {
      global.fetch = vi.fn().mockRejectedValue('error');

      const result = await researchService.getDrafts();

      expect(result).toEqual([]);
    });
  });
});
