import { getSupportedModules, isModuleSupported, MODULE } from ".";

describe('getSupportedModules', () => {
    const oldProcessEnv = process.env;
    afterAll(() => {
        process.env = oldProcessEnv;
    })
    it('returns a default set of modules', () => {
        process.env.REACT_APP_SUPPORTED_MODULES = ''
        expect(getSupportedModules()).toStrictEqual(
            [
                MODULE.CORE,
                MODULE.HOWTO,
                MODULE.MAP,
                MODULE.EVENTS,
                MODULE.RESEARCH,
                MODULE.ACADEMY,
                MODULE.USER,
            ]
        )
    });

    it('loads an additional module based on env configuration', () => {
        process.env.REACT_APP_SUPPORTED_MODULES = ` ${MODULE.HOWTO} `
        expect(getSupportedModules()).toStrictEqual(
            [MODULE.CORE, MODULE.HOWTO]
        )
    });

    it('loads multiple modules based on env configuration', () => {
        process.env.REACT_APP_SUPPORTED_MODULES = ` ${MODULE.HOWTO},${MODULE.EVENTS} `
        expect(getSupportedModules()).toStrictEqual(
            [MODULE.CORE, MODULE.HOWTO, MODULE.EVENTS]
        )
    });

    it('ignores a malformed module definitions', () => {
        process.env.REACT_APP_SUPPORTED_MODULES = `fake module,${MODULE.HOWTO},malicious `
        expect(getSupportedModules()).toStrictEqual(
            [MODULE.CORE, MODULE.HOWTO]
        )
    });
});

describe('isModuleSupported', () => {
    it('returns true for default supported module', () => {
        expect(isModuleSupported(MODULE.CORE))
            .toBe(true);
    });

    it('returns true for module enabled via env', () => {
        process.env.REACT_APP_SUPPORTED_MODULES = `${MODULE.RESEARCH}`
        expect(isModuleSupported(MODULE.RESEARCH))
            .toBe(true);
    });

    it('returns false for unsupported module', () => {
        expect(isModuleSupported(MODULE.EVENTS))
            .toBe(false);
    });
});