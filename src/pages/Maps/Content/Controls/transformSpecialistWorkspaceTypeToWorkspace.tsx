export function transformSpecialistWorkspaceTypeToWorkspace(
  type: string,
): string {
  return ['extrusion', 'injection', 'shredder', 'sheetpress', 'mix'].includes(
    type,
  )
    ? 'workspace'
    : type
}
