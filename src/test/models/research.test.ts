import { ResearchItem } from 'oa-shared';
import { describe, expect, it } from 'vitest';

import { FactoryDBResearchItem, FactoryDBResearchItemUpdate } from '../factories/ResearchItem';

describe('ResearchItem.fromDB', () => {
  it('sorts updates by order', () => {
    const research = FactoryDBResearchItem({
      updates: [
        FactoryDBResearchItemUpdate({ id: 1, order: 2, created_at: new Date('2024-01-01') }),
        FactoryDBResearchItemUpdate({ id: 2, order: 0, created_at: new Date('2024-01-03') }),
        FactoryDBResearchItemUpdate({ id: 3, order: 1, created_at: new Date('2024-01-02') }),
      ],
    });

    const { updates } = ResearchItem.fromDB(research, []);

    expect(updates.map((u) => u.id)).toEqual([2, 3, 1]);
  });

  it('falls back to creation date when order is missing', () => {
    const research = FactoryDBResearchItem({
      updates: [
        FactoryDBResearchItemUpdate({ id: 1, order: null, created_at: new Date('2024-01-03') }),
        FactoryDBResearchItemUpdate({ id: 2, order: null, created_at: new Date('2024-01-01') }),
        FactoryDBResearchItemUpdate({ id: 3, order: 0, created_at: new Date('2024-01-05') }),
      ],
    });

    const { updates } = ResearchItem.fromDB(research, []);

    expect(updates.map((u) => u.id)).toEqual([3, 2, 1]);
  });
});
