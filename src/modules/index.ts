export enum MODULE {
    CORE = 'core',
    HOWTO = 'howto',
    MAP = 'map',
    EVENTS = 'events',
    RESEARCH = 'research',
    ACADEMY = 'academy',
    USER = 'user',
}

export function getSupportedModules(): MODULE[] {
    const envModules: string[] = process?.env?.REACT_APP_SUPPORTED_MODULES?.split(',').map(s => s.trim()) || []
    console.log({ envModules });
    return [MODULE.CORE]
        .concat(
            Object.values(MODULE)
                .filter(module => envModules.includes(module)));
}

export function isModuleSupported(MODULE): boolean {
    return getSupportedModules().includes(MODULE);
}