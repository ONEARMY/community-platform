import { getConfigirationOption } from "src/config/config";

export enum MODULE {
    CORE = 'core', // This is enabled on all installations
    HOWTO = 'howto',
    MAP = 'map',
    EVENTS = 'events',
    RESEARCH = 'research',
    ACADEMY = 'academy',
    USER = 'user',
}

export function getSupportedModules(): MODULE[] {
    const envModules: string[] = getConfigirationOption('REACT_APP_SUPPORTED_MODULES', 'howto,map,events,research,academy,user').split(',').map(s => s.trim()) || []
    return [MODULE.CORE]
        .concat(
            Object.values(MODULE)
                .filter(module => envModules.includes(module)));
}

export function isModuleSupported(MODULE): boolean {
    return getSupportedModules().includes(MODULE);
}