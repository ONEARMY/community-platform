import { seedDatabase } from '../utils/TestUtils'

export const seedComment = async (profiles, sourceData, sourceType) => {
  const tenantId = Cypress.env('TENANT_ID')
  const commentData = await seedDatabase(
    {
      comments: [
        {
          tenant_id: tenantId,
          created_at: new Date().toUTCString(),
          comment: 'First comment',
          created_by: profiles.data[0].id,
          source_type: sourceType,
          source_id: sourceData.data[0].id,
        },
      ],
    },
    tenantId,
  )
  return commentData
}

export const seedReply = async (profiles, comments, source) => {
  const tenantId = Cypress.env('TENANT_ID')
  await seedDatabase(
    {
      comments: [
        {
          tenant_id: tenantId,
          created_at: new Date().toUTCString(),
          comment: 'First Reply',
          created_by: profiles.data[0].id,
          source_type: comments.data[0].source_type,
          source_id: source.data[0].id,
          parent_id: comments.data[0].id,
        },
      ],
    },
    tenantId,
  )
}
