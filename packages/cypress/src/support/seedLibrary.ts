import { MOCK_DATA } from '../data'
import { seedDatabase } from '../utils/TestUtils'
import { seedComment, seedReply } from './seedDiscussions'
import { seedCategories } from './seedQuestions'

export const seedLibrary = async (profiles, tagsData) => {
  const tenantId = Cypress.env('TENANT_ID')
  Cypress.log({
    displayName: 'Seeding database library for tenant',
    message: tenantId,
  })

  const { categories } = await seedCategories('projects')

  const projectsData = []

  for (let i = 0; i < MOCK_DATA.projects.length; i++) {
    const item = MOCK_DATA.projects[i]

    projectsData.push({
      created_at: item.createdAt,
      modified_at: item.modifiedAt,
      title: item.title,
      description: item.description,
      slug: item.slug,
      time: item.time,
      difficulty_level: item.difficultyLevel,
      created_by:
        profiles.find((x) => x.username === item.createdBy).id || null,
      tags: [tagsData.data[0].id, tagsData.data[1].id],
      category: categories.data[i % 2].id,
      deleted: item.deleted,
      moderation: item.moderation,
      tenant_id: tenantId,
      ...(item.moderationFeedback
        ? { moderation_feedback: item.moderationFeedback }
        : {}),
    })
  }

  // seed projects
  const { projects } = await seedDatabase(
    {
      projects: projectsData,
    },
    tenantId,
  )

  // seed steps
  for (let i = 0; i < MOCK_DATA.projects.length; i++) {
    const project = MOCK_DATA.projects[i]

    if (project.steps && project.steps.length) {
      await seedDatabase(
        {
          project_steps: project.steps.map((item) => ({
            title: item.title,
            project_id: projects.data[i].id,
            description: item.description,
            video_url: item.video_url,
            tenant_id: tenantId,
          })),
        },
        tenantId,
      )
    }
  }

  // seed comments
  const { comments } = await seedComment(profiles, projects, 'projects')
  await seedReply(profiles, comments, projects)
}
