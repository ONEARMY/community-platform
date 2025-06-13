// This is basically an identical set of steps to the discussion tests for
// projects, research and news. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

describe('[Library.Discussions]', () => {
  it('shows existing comments', () => {
    const project = MOCK_DATA.library[0]
    cy.visit(`/library/${project.slug}`)
    cy.get(`[data-cy=comment-text]`).contains('First comment')
    cy.get('[data-cy=show-replies]').click()
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply')
  })

  it('allows authenticated users to contribute to discussions', () => {
    const commenter = generateNewUserDetails()
    const project = MOCK_DATA.library[0]

    const newComment = `An interesting question. The answer must be... ${commenter.username}`
    const updatedNewComment = `An interesting question. The answer must be that when the sky is red, the apocalypse _might_ be on the way. Love, ${commenter.username}`
    const projectPath = `/library/${project.slug}`

    cy.signIn(MOCK_DATA.users.admin.email, MOCK_DATA.users.admin.password)

    cy.visit(projectPath)
    cy.contains('Start the discussion')
    cy.addComment(newComment)

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment)

    cy.logout()
  })
})
