import { describe, expect, it } from 'vitest';

import { getSupportedModules, isModuleSupported, MODULE } from './index';

describe('getSupportedModules', () => {
  it('returns a default set of modules', () => {
    expect(getSupportedModules('')).toStrictEqual([
      MODULE.LIBRARY,
      MODULE.MAP,
      MODULE.RESEARCH,
      MODULE.ACADEMY,
      MODULE.QUESTIONS,
      MODULE.NEWS,
    ]);
  });

  it('loads an additional module based on env configuration', () => {
    expect(getSupportedModules(MODULE.LIBRARY)).toStrictEqual([MODULE.LIBRARY]);
  });

  it('loads multiple modules based on env configuration', () => {
    expect(getSupportedModules(`${MODULE.LIBRARY},${MODULE.ACADEMY}`)).toStrictEqual([MODULE.LIBRARY, MODULE.ACADEMY]);
  });

  it('ignores a malformed module definitions', () => {
    expect(getSupportedModules(`fake module,${MODULE.LIBRARY},malicious `)).toStrictEqual([MODULE.LIBRARY]);
  });
});

describe('isModuleSupported', () => {
  it('returns true for module enabled via env', () => {
    expect(isModuleSupported(`${MODULE.RESEARCH}`, MODULE.RESEARCH)).toBe(true);
  });

  it('returns false for unsupported module', () => {
    expect(isModuleSupported(`${MODULE.LIBRARY}`, MODULE.RESEARCH)).toBe(false);
  });
});
