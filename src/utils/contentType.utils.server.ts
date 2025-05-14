export function resolveType(type: string) {
  if (
    type === 'library' ||
    type === 'research' ||
    type === 'research_updates'
  ) {
    return type
  }

  if (type === 'research_update') {
    return 'research_updates'
  }

  return null
}
