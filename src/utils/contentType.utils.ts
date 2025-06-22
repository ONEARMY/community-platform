export function resolveType(type: string) {
  if (type === 'research_update') {
    return 'research_updates'
  }
  if (type === 'project') {
    return 'projects'
  }

  return type
}
