export enum ResearchStatus {
  IN_PROGRESS = 'In progress',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export enum ResearchUpdateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export const researchStatusOptions = (
  Object.keys(ResearchStatus) as (keyof typeof ResearchStatus)[]
).map((status) => {
  return {
    label: ResearchStatus[status],
    value: ResearchStatus[status],
  }
})
