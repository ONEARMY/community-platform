// This is basically an identical set of steps to the discussion tests for
// questions and research. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

const howtos = Object.values(MOCK_DATA.howtos)

const item = howtos[0]
const howtoDiscussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item._id,
)

describe('[Howto.Discussions]', () => {
  it('can open using deep links', () => {
    const firstComment = howtoDiscussion.comments[0]

    cy.signUpNewUser()
    cy.visit(`/how-to/${item.slug}#comment:${firstComment._id}`)
    cy.get('[data-cy="comment"]').should('have.length.gte', 2)
    cy.get('[data-cy="comment"]')
      .first()
      .scrollIntoView()
      .should('be.inViewport', 10)
    cy.contains(firstComment.text)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const newComment = 'An interesting howto. The answer must be...'
    const updatedNewComment =
      'An interesting howto. The answer must be that when the sky is red, the apocalypse _might_ be on the way.'
    const newReply = 'Thanks Dave and Ben. What does everyone else think?'
    const updatedNewReply = 'Anyone else?'

    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/how-to/${item.slug}`)

    cy.step('Can add comment')
    cy.get('[data-cy=comments-form]:last').type(newComment)
    cy.get('[data-cy=comment-submit]:last').click()
    cy.contains(`${howtoDiscussion.comments.length + 1} comments`)
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
    cy.contains(`${howtoDiscussion.comments.length} comments`)

    cy.step('Can add reply')
    cy.get('[data-cy=show-replies]:first').click()
    cy.get('[data-cy=comments-form]:first').type(newReply)
    cy.get('[data-cy=comment-submit]:first').click()
    cy.contains(`${howtoDiscussion.comments.length + 1} comments`)
    cy.contains(newReply)
    cy.queryDocuments('howtos', '_id', '==', item._id).then((docs) => {
      const [howto] = docs
      expect(howto.totalComments).to.eq(howtoDiscussion.comments.length + 1)
      // Updated to the just added comment iso datetime
      expect(howto.latestCommentDate).to.not.eq(item.latestCommentDate)
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
    cy.contains(`${howtoDiscussion.comments.length} comments`)
    cy.queryDocuments('howtos', '_id', '==', item._id).then((docs) => {
      const [howto] = docs
      expect(howto.totalComments).to.eq(howtoDiscussion.comments.length)
      expect(howto.latestCommentDate).to.eq(item.latestCommentDate)
    })

    // Putting these at the end to avoid having to put a wait in the test
    cy.step('Comment generated notification for question author')
    cy.queryDocuments('users', 'userName', '==', item._createdBy).then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type, triggeredBy }) =>
            type === 'new_comment_discussion' &&
            triggeredBy.userId === visitor.username,
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/how-to/${item.slug}#comment:`,
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
          ({ type, triggeredBy }) =>
            type === 'new_comment_discussion' &&
            triggeredBy.userId === visitor.username,
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/how-to/${item.slug}#comment:`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )
  })
})
