export const transformSpecialistWorkspaceTypeToWorkspace = (
  type: string,
): string =>
  ['extrusion', 'injection', 'shredder', 'sheetpress', 'mix'].includes(type)
    ? 'workspace'
    : type
