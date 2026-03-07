export enum MODULE {
  LIBRARY = 'library',
  MAP = 'map',
  RESEARCH = 'research',
  ACADEMY = 'academy',
  QUESTIONS = 'questions',
  NEWS = 'news',
}

export const getSupportedModules = (supportedModules: string): MODULE[] => {
  const envModules: string[] = (supportedModules || 'library,map,research,academy,questions,news').split(',').map((s) => s.trim()) || [];
  return Object.values(MODULE).filter((module) => envModules.includes(module));
};

export const isModuleSupported = (supportedModules: string, MODULE: MODULE): boolean => {
  const supported = getSupportedModules(supportedModules);
  return supported.includes(MODULE);
};
