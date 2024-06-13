// This is basically an identical set of steps to the discussion tests for
// how-tos and research. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

const questions = Object.values(MOCK_DATA.questions)

const item = questions[0]
const discussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item._id,
)
const firstComment = discussion.comments[0]

describe('[Questions.Discussions]', () => {
  it('can open using deep links', () => {
    cy.signUpNewUser()
    cy.visit(`/questions/${item.slug}#comment:${firstComment._id}`)
    cy.get('[data-cy="comment"]').should('have.length.gte', 2)
    cy.get('[data-cy="comment"]')
      .first()
      .scrollIntoView()
      .should('be.inViewport', 10)
    cy.contains(firstComment.text)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const newComment = 'An interesting question. The answer must be...'
    const updatedNewComment =
      'An interesting question. The answer must be that when the sky is red, the apocalypse _might_ be on the way.'
    const newReply = 'Thanks Dave and Ben. What does everyone else think?'
    const updatedNewReply = 'Anyone else?'

    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/questions/${item.slug}`)

    cy.step('Can add comment')
    cy.get('[data-cy=comments-form]:last').type(newComment)
    cy.get('[data-cy=comment-submit]:last').click()
    cy.contains(`${discussion.comments.length + 1} comments`)
    cy.contains(newComment)

    cy.step('Can edit their comment')
    cy.get('[data-cy="CommentItem: edit button"]:last').click()
    cy.get('[data-cy=edit-comment]').clear().type(updatedNewComment)
    cy.get('[data-cy=edit-comment-submit]').click()
    cy.contains(updatedNewComment)
    cy.contains(newComment).should('not.exist')

    cy.step('Can delete their comment')
    cy.get('[data-cy="CommentItem: delete button"]:last').click()
    cy.get('[data-cy="Confirm.modal: Confirm"]:last').click()
    cy.contains(updatedNewComment).should('not.exist')
    cy.contains(`${discussion.comments.length} comments`)

    cy.step('Can add reply')
    cy.get('[data-cy=show-replies]:first').click()
    cy.get('[data-cy=comments-form]:first').type(newReply)
    cy.get('[data-cy=comment-submit]:first').click()
    cy.contains(`${discussion.comments.length + 1} comments`)
    cy.contains(newReply)
    cy.queryDocuments('questions', '_id', '==', item._id).then((docs) => {
      const [question] = docs
      expect(question.commentCount).to.eq(discussion.comments.length + 1)
      // Updated to the just added comment iso datetime
      expect(question.latestCommentDate).to.not.eq(item.latestCommentDate)
    })

    cy.step('Can edit their reply')
    cy.get('[data-cy="CommentItem: edit button"]:first').click()
    cy.get('[data-cy=edit-comment]').clear().type(updatedNewReply)
    cy.get('[data-cy=edit-comment-submit]').click()
    cy.contains(updatedNewReply)
    cy.contains(newReply).should('not.exist')

    cy.step('Can delete their reply')
    cy.get('[data-cy="CommentItem: delete button"]:first').click()
    cy.get('[data-cy="Confirm.modal: Confirm"]:first').click()
    cy.contains(updatedNewReply).should('not.exist')
    cy.contains(`${discussion.comments.length} comments`)
    cy.queryDocuments('questions', '_id', '==', item._id).then((docs) => {
      const [question] = docs
      expect(question.commentCount).to.eq(discussion.comments.length)
      expect(question.latestCommentDate).to.eq(item.latestCommentDate)
    })

    // Putting these at the end to avoid having to put a wait in the test
    cy.step('Comment generated notification for question author')
    cy.queryDocuments('users', 'userName', '==', item._createdBy).then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type }) => type === 'new_comment_discussion',
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/questions/${item.slug}#comment:`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )

    cy.step('Reply generates notification for comment author')
    cy.queryDocuments('users', 'userName', '==', 'howto_creator').then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type }) => type === 'new_comment_discussion',
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/questions/${item.slug}#comment:`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )

    cy.step('User avatars only visible to beta-testers')
    cy.contains('[data-cy=commentAvatar]').should('not.exist')
    cy.logout()
    cy.login('demo_beta_tester@example.com', 'demo_beta_tester')
    cy.visit(`/questions/${item.slug}`)
    cy.get('[data-cy="commentAvatar"]')
  })
})
