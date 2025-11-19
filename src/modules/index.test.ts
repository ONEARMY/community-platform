import { afterAll, describe, expect, it } from 'vitest';

import { getSupportedModules, isModuleSupported, MODULE } from './index';

describe('getSupportedModules', () => {
  const defaultModules = import.meta.env.VITE_SUPPORTED_MODULES;
  afterAll(() => {
    import.meta.env.VITE_SUPPORTED_MODULES = defaultModules;
  });

  it('returns a default set of modules', () => {
    import.meta.env.VITE_SUPPORTED_MODULES = '';
    expect(getSupportedModules(import.meta.env.VITE_SUPPORTED_MODULES)).toStrictEqual([
      MODULE.CORE,
      MODULE.HOWTO,
      MODULE.MAP,
      MODULE.RESEARCH,
      MODULE.ACADEMY,
      MODULE.USER,
      MODULE.QUESTION,
      MODULE.NEWS,
    ]);
  });

  it('loads an additional module based on env configuration', () => {
    import.meta.env.VITE_SUPPORTED_MODULES = ` ${MODULE.HOWTO} `;
    expect(getSupportedModules(import.meta.env.VITE_SUPPORTED_MODULES)).toStrictEqual([
      MODULE.CORE,
      MODULE.HOWTO,
    ]);
  });

  it('loads multiple modules based on env configuration', () => {
    import.meta.env.VITE_SUPPORTED_MODULES = ` ${MODULE.HOWTO} `;
    expect(getSupportedModules(import.meta.env.VITE_SUPPORTED_MODULES)).toStrictEqual([
      MODULE.CORE,
      MODULE.HOWTO,
    ]);
  });

  it('ignores a malformed module definitions', () => {
    import.meta.env.VITE_SUPPORTED_MODULES = `fake module,${MODULE.HOWTO},malicious `;
    expect(getSupportedModules(import.meta.env.VITE_SUPPORTED_MODULES)).toStrictEqual([
      MODULE.CORE,
      MODULE.HOWTO,
    ]);
  });
});

describe('isModuleSupported', () => {
  it('returns true for default supported module', () => {
    expect(isModuleSupported('', MODULE.CORE)).toBe(true);
  });

  it('returns true for module enabled via env', () => {
    import.meta.env.VITE_SUPPORTED_MODULES = `${MODULE.RESEARCH}`;
    expect(isModuleSupported(import.meta.env.VITE_SUPPORTED_MODULES, MODULE.RESEARCH)).toBe(true);
  });

  it('returns false for unsupported module', () => {
    import.meta.env.VITE_SUPPORTED_MODULES = `${MODULE.HOWTO}`;
    expect(isModuleSupported(import.meta.env.VITE_SUPPORTED_MODULES, MODULE.RESEARCH)).toBe(false);
  });
});
