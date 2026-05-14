import { describe, expect, it } from 'vitest';

import { MODULE } from 'src/modules';

import { getAvailablePageList } from './PageList';

describe('getAvailablePageList', () => {
  it('filters out hidden modules from available pages', () => {
    const supported = [MODULE.LIBRARY, MODULE.QUESTIONS, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).toContain(MODULE.LIBRARY);
    expect(modules).toContain(MODULE.MAP);
    expect(modules).not.toContain(MODULE.QUESTIONS);
  });
});
