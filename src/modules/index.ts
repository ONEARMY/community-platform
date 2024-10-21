export enum MODULE {
  CORE = 'core', // This is enabled on all installations
  HOWTO = 'howto',
  MAP = 'map',
  RESEARCH = 'research',
  ACADEMY = 'academy',
  USER = 'user',
  QUESTION = 'question',
}

export const getSupportedModules = (supportedModules: string): MODULE[] => {
  const envModules: string[] =
    (supportedModules || 'howto,map,research,academy,user,question')
      .split(',')
      .map((s) => s.trim()) || []
  return [MODULE.CORE].concat(
    Object.values(MODULE).filter((module) => envModules.includes(module)),
  )
}

export const isModuleSupported = (
  supportedModules: string,
  MODULE: MODULE,
): boolean => {
  const supported = getSupportedModules(supportedModules)
  return supported.includes(MODULE)
}
