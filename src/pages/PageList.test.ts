import { describe, expect, it } from 'vitest';

import { MODULE } from 'src/modules';

import { getAvailablePageList } from './PageList';

describe('getAvailablePageList', () => {
  it('includes supported and not hidden modules', () => {
    const supported = [MODULE.LIBRARY, MODULE.QUESTIONS, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).toContain(MODULE.LIBRARY);
    expect(modules).toContain(MODULE.MAP);
  });

  it('excludes supported but hidden modules', () => {
    const supported = [MODULE.LIBRARY, MODULE.QUESTIONS, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).not.toContain(MODULE.QUESTIONS);
  });

  it('excludes unsupported modules even if hidden', () => {
    const supported = [MODULE.LIBRARY, MODULE.MAP];
    const result = getAvailablePageList(supported, 'questions');
    const modules = result.map((p) => p.module);

    expect(modules).not.toContain(MODULE.QUESTIONS);
  });
});
